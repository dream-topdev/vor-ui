import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import { useHistory } from "react-router"
import { ethers } from "ethers"
import { TextField } from "@material-ui/core"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import IconButton from "@material-ui/core/IconButton"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import { CSVReader } from "react-papaparse"
import LoadingButton from "../components/LoadingButton"
import { MockERC20ABI, VORCoordinatorABI, XYDistributionABI } from "../abis/abis"
import { initOnboard, initNotify } from "../utils/services"
import getSigner from "../utils/signer"
import Header from "../components/WalletHeader/Header"
import { shuffle, networkName } from "../utils/common"
import {
  ONE_TO_ONE_MAPPING,
  X_FROM_Y,
  MAXIMUM_FEE,
  VORCOORDINATOR_ADDRESS,
  XFUND_ADDRESS,
  XYDistribution_ADDRESS,
} from "../utils/Constants"
import { getOracles, addDatatoIPFS } from "../api"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(2),
    width: 600,
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
    "& .MuiFormControl-root": {
      margin: theme.spacing(1),
    },
    "& .MuiButtonBase-root": {
      margin: theme.spacing(2),
    },
  },
  metaroot: {
    width: "100%",
    margin: theme.spacing(1),
  },
  metarow: {
    display: "flex",
    alignItems: "center",
  },
  metaheader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monikerRow: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "normal",
    fontSize: 24,
    marginBottom: 11,
    lineHeight: "36px",
    color: "#000000",
  },
  bottomBtn: {
    height: 69,
    lineHeight: "25px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 22,
    background: "#41A0E6",
    color: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
    "&:hover": {
      background: "#1482d4",
    },
  },
}))

let xFundContract
let XYDistContract
let VORCoordinator

function App() {
  const classes = useStyles()
  const [type, setType] = useState(ONE_TO_ONE_MAPPING)
  const [source, setSource] = useState([])
  const [target, setTarget] = useState([])
  const [selectCount, setSelectCount] = useState(0)
  const [usermeta, setUserMeta] = useState([])
  const [preshuffleSource, setPreshuffleSource] = useState(false)
  const [preshuffleTarget, setPreshuffleTarget] = useState(false)
  const [seed, setSeed] = useState(0)
  const [keyHash, setKeyHash] = useState("")
  const [oracleList, setOracleList] = useState([])
  const [loading, setLoading] = useState(false)

  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [balance, setBalance] = useState(null)
  const [wallet, setWallet] = useState({})
  const [moniker, setMonicker] = useState(null)

  const [onboard, setOnboard] = useState(null)
  const [notify, setNotify] = useState(null)
  const [allowLoading, setAllowLoading] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const history = useHistory()

  function gotoExplore() {
    history.push(`/portal`)
  }

  async function getMoniker() {
    const result = await XYDistContract.getMoniker()
    setMonicker(result)
    if (!result) {
      gotoExplore()
    }
  }

  async function checkAllowance() {
    const result = await xFundContract.allowance(address, XYDistContract.address)
    console.log("allowance", result.toString())
    if (result.gt("1000000000000")) setAllowed(true)
  }

  useEffect(() => {
    getOracles().then((res) => {
      setOracleList(res.oracles)
    })
    setSeed(Date.now())
    const board = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: (w) => {
        if (w.provider) {
          setWallet(w)

          window.localStorage.setItem("selectedWallet", w.name)
        } else {
          setWallet({})
          window.localStorage.removeItem("selectedWallet")
        }
      },
    })

    setOnboard(board)

    setNotify(initNotify())
  }, [])

  useEffect(() => {
    if( address && wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider)

      xFundContract = new ethers.Contract(XFUND_ADDRESS, MockERC20ABI, getSigner(ethersProvider))
      VORCoordinator = new ethers.Contract(
        VORCOORDINATOR_ADDRESS,
        VORCoordinatorABI,
        getSigner(ethersProvider),
      )
      XYDistContract = new ethers.Contract(
        XYDistribution_ADDRESS,
        XYDistributionABI,
        getSigner(ethersProvider),
      )
      getMoniker()
    }
  }, [address, wallet])

  useEffect(() => {
    if (address && xFundContract) checkAllowance()
  }, [address, xFundContract])

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem("selectedWallet")

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  async function startDistribute(_IpfsHash, _sourceCnt, _targetCnt, _distType, _seed, _keyHash) {
    if (!_keyHash) {
      alert("An Oracle is required.")
      return
    }
    try {
      setLoading(true)
      const fee = await VORCoordinator.getProviderGranularFee(_keyHash, XYDistContract.address)
      const { hash, wait } = await XYDistContract.startDistribute(
        _IpfsHash,
        _sourceCnt,
        _targetCnt,
        _distType,
        _seed,
        _keyHash,
        fee,
      )
      wait().then(async () => {
        setLoading(false)
        gotoExplore()
      })

      const { emitter } = notify.hash(hash)

      emitter.on("txSent", console.log)
      emitter.on("txPool", console.log)
      emitter.on("txConfirmed", console.log)
      emitter.on("txSpeedUp", console.log)
      emitter.on("txCancel", console.log)
      emitter.on("txFailed", console.log)
    } catch (e) {
      setLoading(false)
    }
  }

  async function allowRequest() {
    if (!keyHash) {
      alert("An Oracle is required.")
      return
    }
    try {
      setAllowLoading(true)
      const { hash, wait } = await xFundContract.increaseAllowance(XYDistContract.address, MAXIMUM_FEE)
      wait().then(async () => {
        setAllowLoading(false)
        setAllowed(true)
      })
      const { emitter } = notify.hash(hash)

      emitter.on("txSent", console.log)
      emitter.on("txPool", console.log)
      emitter.on("txConfirmed", (e) => {
        console.log(e)
        setAllowLoading(false)
        setAllowed(true)
      })
      emitter.on("txSpeedUp", console.log)
      emitter.on("txCancel", console.log)
      emitter.on("txFailed", console.log)
    } catch (e) {
      setAllowLoading(false)
    }
  }

  function checkSourceTargets() {
    const sourceArray = source
    const destArray = target
    if (sourceArray.length === 0) return "Please uplod csv file"
    if (type === ONE_TO_ONE_MAPPING && sourceArray.length !== destArray.length)
      return "Source length and Target length is not matching"
    if (type === X_FROM_Y && sourceArray.length < selectCount)
      return "Target length is bigger than source length"
    if (type === X_FROM_Y && selectCount <= 0) return "Target count is required"
    return ""
  }

  function getMeta() {
    return usermeta
      .filter((item) => item[0] !== "" && item[1] !== "")
      .map((item) => ({
        [item[0]]: item[1],
      }))
  }

  function generateJSON() {
    const sourceArray = source
    const destArray = target
    const data = {
      requester_wallet_address: address,
      request_time: Date.now(),
      request_metadata: getMeta(),
      sources: preshuffleSource ? shuffle(sourceArray) : sourceArray,
      num_sources: sourceArray.length,
      type,
      seed,
    }
    if (type === ONE_TO_ONE_MAPPING) {
      data.target = preshuffleTarget ? shuffle(destArray) : destArray
      data.num_targets = destArray.length
    } else {
      data.num_selections = selectCount
    }

    return data
  }

  function handleSubmit(e) {
    e.preventDefault()
    const checkResult = checkSourceTargets()
    if (checkResult !== "") return alert(checkResult)
    if (!keyHash) return alert("An oracle is required")
    const data = generateJSON()
    setLoading(true)
    addDatatoIPFS(moniker, address, data)
      .then((res) => {
        console.log("upload success", res)
        startDistribute(
          res.IpfsHash,
          data.num_sources,
          data.num_selections || data.num_targets,
          data.type,
          data.seed,
          keyHash,
        )
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
    return false
  }

  function onChangeMeta(index, key, event) {
    const newmeta = [...usermeta]
    newmeta[index][key] = event.target.value
    setUserMeta(newmeta)
  }

  function renderMetaFields() {
    return (
      <div className={classes.metaroot}>
        <div className={classes.metaheader}>
          <div>Meta Fields</div>
          <IconButton
            color="primary"
            component="span"
            size="small"
            onClick={() => {
              const newmeta = [...usermeta, ["", ""]]
              setUserMeta(newmeta)
            }}
          >
            <AddIcon />
          </IconButton>
        </div>
        <div>
          {usermeta.map((item, index) => {
            return (
              <div key={index} className={classes.metarow}>
                <TextField
                  id="outlined-basic"
                  label="ID"
                  variant="outlined"
                  value={item[0]}
                  onChange={(value) => {
                    onChangeMeta(index, 0, value)
                  }}
                />
                <TextField
                  id="outlined-basic"
                  label="Value"
                  variant="outlined"
                  value={item[1]}
                  onChange={(value) => {
                    onChangeMeta(index, 1, value)
                  }}
                />
                <IconButton
                  color="primary"
                  size="small"
                  component="span"
                  onClick={() => {
                    const newmeta = usermeta.filter((ele, i) => i !== index)
                    setUserMeta(newmeta)
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function handleOnDrop(from, csv) {
    if (from === "source") {
      const sArr = []
      for (let i = 0; i < csv.length; i += 1) {
        if (csv[i].data[0] !== "") {
          sArr.push(csv[i].data[0])
        }
      }
      setSource(sArr)
    } else {
      const tArr = []
      for (let i = 0; i < csv.length; i += 1) {
        if (csv[i].data[0] !== "") {
          tArr.push(csv[i].data[0])
        }
      }
      setTarget(tArr)
    }
  }
  function handleOnError(from, err) {
    console.log(from, err)
  }
  function handleOnRemoveFile(from, data) {
    console.log(data)
    if (from === "source") setSource([])
    else setTarget([])
  }

  return onboard && notify ? (
    <div>
      <Header
        onWalletConnect={async () => {
          await onboard.walletSelect()
          await onboard.walletCheck()
        }}
        onWalletDisconnect={() => {
          onboard.walletReset()
        }}
        address={address}
        balance={balance}
        network={networkName(network)}
      />
      {!address ? (
        <div>Please connect your wallet first to access the portal</div>
      ) : (
        <div className={classes.root}>
          <div className={classes.monikerRow}>Your moniker: {moniker}</div>
          <Button className={classes.bottomBtn} onClick={gotoExplore}>
            Back to Explore
          </Button>
          <form className={classes.form} onSubmit={handleSubmit}>
            <FormControl className={classes.formControl}>
              <InputLabel id="type">Distribution Type</InputLabel>
              <Select labelId="type" value={type} onChange={(e) => setType(e.target.value)}>
                <MenuItem value={ONE_TO_ONE_MAPPING}>one-to-one mapping and distribution</MenuItem>
                <MenuItem value={X_FROM_Y}>x-to-y mapping and distribution</MenuItem>
              </Select>
            </FormControl>
            <CSVReader
              onDrop={(e) => handleOnDrop("source", e)}
              onError={(e) => handleOnError("source", e)}
              addRemoveButton
              onRemoveFile={(e) => handleOnRemoveFile("source", e)}
            >
              <span>Drop CSV file here or click to upload source.</span>
            </CSVReader>
            <TextField
              label="Source"
              multiline
              rows={4}
              value={source.join(";\n")}
              variant="outlined"
              fullWidth
              disabled={true}
              onChange={(e) => {
                setSource(e.target.value)
              }}
            />
            {type === ONE_TO_ONE_MAPPING && (
              <CSVReader
                onDrop={(e) => handleOnDrop("target", e)}
                onError={(e) => handleOnError("target", e)}
                addRemoveButton
                onRemoveFile={(e) => handleOnRemoveFile("target", e)}
              >
                <span>Drop CSV file here or click to upload target.</span>
              </CSVReader>
            )}
            {type === ONE_TO_ONE_MAPPING ? (
              <TextField
                label="Target"
                multiline
                rows={4}
                value={target.join(";\n")}
                variant="outlined"
                fullWidth
                disabled={true}
                onChange={(e) => {
                  setTarget(e.target.value)
                }}
              />
            ) : (
              <TextField
                label="Select Count"
                variant="outlined"
                value={selectCount}
                onChange={(e) => setSelectCount(e.target.value)}
              />
            )}
            {renderMetaFields()}
            <FormControlLabel
              control={
                <Checkbox
                  checked={preshuffleSource}
                  onChange={(e, chk) => {
                    setPreshuffleSource(chk)
                  }}
                />
              }
              label="Pre-shuffe source"
            />
            {type === ONE_TO_ONE_MAPPING && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preshuffleTarget}
                    onChange={(e, chk) => {
                      setPreshuffleTarget(chk)
                    }}
                  />
                }
                label="Pre-shuffe destination"
              />
            )}
            <FormControl className={classes.formControl}>
              <InputLabel id="type">Select Oracle</InputLabel>
              <Select labelId="type" value={keyHash} onChange={(e) => setKeyHash(e.target.value)}>
                {oracleList.map((item) => (
                  <MenuItem key={item.keyHash} value={item.keyHash}>
                    {item.keyHash}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Seed"
              variant="outlined"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
            />
            {!allowed && (
              <LoadingButton
                loading={allowLoading}
                disabled={allowed}
                onClick={allowRequest}
                className={classes.bottomBtn}
              >
                Allow distribute
              </LoadingButton>
            )}
            <LoadingButton loading={loading} disabled={!allowed} type="submit" className={classes.bottomBtn}>
              Start Distribute
            </LoadingButton>
          </form>
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default App
