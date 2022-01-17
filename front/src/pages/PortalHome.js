import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import { useHistory } from "react-router"
import { ethers } from "ethers"
import { TextField } from "@material-ui/core"
import VisibilityIcon from "@material-ui/icons/Visibility"
import { getDistRequesters, getDistRequests } from "../api"
import { XYDistribution_ADDRESS } from "../utils/Constants"
import { openAddress, openIPFS, openTx, toXFund, networkName } from "../utils/common"
import Header from "../components/WalletHeader/Header"
import getSigner from "../utils/signer"
import { initOnboard, initNotify } from "../utils/services"
import { XYDistributionABI } from "../abis/abis"
import CustomPaginationActionsTable from "../components/PaginationTable"
import LoadingButton from "../components/LoadingButton"

const useStyles = makeStyles({
  container: {
    padding: 18,
  },
  wrapper: {
    marginTop: 30,
  },
  inputField: {
    fontFamily: "Poppins, sans-serif",
    flex: 1,
    fontSize: 32,
    marginBottom: 22,
  },
  monikerRow: {
    fontFamily: "Poppins, sans-serif",
    // font-style: normal,
    fontWeight: "normal",
    fontSize: 24,
    marginBottom: 11,
    lineHeight: "36px",
    color: "#000000",
  },
  centerAlign: {
    display: "flex",
    justifyContent: "center",
  },
  registerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
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
  tableHeader: {
    fontFamily: "Poppins, sans-serif",
    // font-style: normal,
    fontWeight: "normal",
    fontSize: 24,
    marginBottom: 11,
    lineHeight: "36px",
    color: "#000000",
  },
})

let XYDistContract

function App() {
  const classes = useStyles()
  const history = useHistory()
  const [address, setAddress] = useState(null)
  const [network, setNetwork] = useState(null)
  const [balance, setBalance] = useState(null)
  const [wallet, setWallet] = useState({})
  const [moniker, setMonicker] = useState(null)
  const [monikerEdit, setMonickerEdit] = useState(null)

  const [onboard, setOnboard] = useState(null)
  const [notify, setNotify] = useState(null)
  const [loading, setLoading] = useState(null)

  async function getMoniker() {
    const result = await XYDistContract.getMoniker()

    if (result) setMonicker(result)
  }

  useEffect(() => {
    const _onboard = initOnboard({
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

    setOnboard(_onboard)

    setNotify(initNotify())
  }, [])

  useEffect(() => {
    if (address && wallet) {
      const ethersProvider = new ethers.providers.Web3Provider(wallet.provider)

      XYDistContract = new ethers.Contract(
        XYDistribution_ADDRESS,
        XYDistributionABI,
        getSigner(ethersProvider),
      )
      getMoniker()
      
    }
  }, [address, wallet])

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem("selectedWallet")

    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  async function registerMoniker() {
    if (!monikerEdit) return alert("Moniker is required")
    if (monikerEdit.length > 30) return alert("Moniker should be less than 30 characters")
    try {
      setLoading(true)
      const { hash, wait } = await XYDistContract.registerMoniker(monikerEdit)
      wait().then(async () => {
        setLoading(false)
        getMoniker()
      })

      const { emitter } = notify.hash(hash)

      emitter.on("txSent", console.log)
      emitter.on("txPool", console.log)
      emitter.on("txConfirmed", () => {
        getMoniker()
      })
      emitter.on("txSpeedUp", console.log)
      emitter.on("txCancel", console.log)
      emitter.on("txFailed", console.log)
    } catch (e) {
      setLoading(false)
    }
    return null
  }

  function gotoRequest() {
    history.push(`/portal/request`)
  }

  return onboard && notify ? (
    <div className={classes.container}>
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
        <div>
          {moniker == null ? (
            <div className={classes.registerWrapper}>
              <TextField
                variant="filled"
                className={classes.inputField}
                id="input-with-icon-textfield"
                placeholder="Please input your moniker"
                onChange={(e) => {
                  setMonickerEdit(e.target.value)
                }}
                InputProps={{}}
              />
              <LoadingButton
                loading={loading}
                className={classes.bottomBtn}
                onClick={() => {
                  registerMoniker()
                }}
              >
                Register Moniker
              </LoadingButton>
            </div>
          ) : (
            <div>
              <div className={classes.monikerRow}>Your moniker: {moniker}</div>
              <div className={classes.centerAlign}>
                <Button
                  className={classes.bottomBtn}
                  onClick={() => {
                    gotoRequest()
                  }}
                >
                  Request Randomness
                </Button>
              </div>
              <h3 className={classes.tableHeader}>My Requests</h3>
              <RequestTable address={address} history={history} />
              <h3 className={classes.tableHeader}>All requesters</h3>
              <RequesterTable address={address} history={history} />
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div>Loading...</div>
  )
}

function RequestTable({ address, history }) {
  const [reload] = useState(1)
  const loadData = (page, rowsPerPage) => {
    return getDistRequests(address, page, rowsPerPage).then((res) => {
      const {
        requests = {
          count: 0,
          rows: [],
        },
      } = res
      const { count, rows } = requests
      const parsedRows = rows.map((item, index) => {
        const pItem = {
          id: item.requestID,
          index: index + 1,
          distID: item.distID,
          status: item.DistributeResult ? "Fulfilled" : "Request",
          sourceCount: item.sourceCount,
          targetCount: item.destCount,
          output: item.DistributeResult ? item.DistributeResult.beginIndex : "",
          ipfs: item.ipfs,
          requestTxHash: item.txHash,
          requestFee: toXFund(item.fee),
          fulfilledTxHash: item.DistributeResult ? item.DistributeResult.txHash : "",
        }
        return pItem
      })
      return {
        rows: parsedRows,
        count,
      }
    })
  }

  const goDistDetail = (item) => {
    history.push(`/portal/request/${item.distID}`, {
      data: item,
    })
  }

  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={reload}
      fields={[
        { value: "index", label: "#" },
        { action: goDistDetail, icon: <VisibilityIcon />, label: "Action" },
        { value: "distID", label: "Distribution ID", action: goDistDetail },
        { value: "status", label: "Status" },
        { value: "sourceCount", label: "Source Count" },
        { value: "targetCount", label: "Target Count" },
        { value: "output", label: "Random Value" },
        { value: "ipfs", label: "IPFS", link: openIPFS },
        { value: "requestTxHash", label: "Request TX Hash", link: openTx },
        { value: "requestFee", label: "Request Fee" },
        { value: "fulfilledTxHash", label: "Fulfilled TX Hash", link: openTx },
      ]}
      pagination={[15, 25, 40, { label: "All", value: -1 }]}
    />
  )
}

RequestTable.propTypes = {
  history: PropTypes.object.isRequired,
  address: PropTypes.string,
}

function RequesterTable({ history }) {
  const [reload] = useState(1)
  const loadData = () => {
    return getDistRequesters().then((res) => {
      const { requesters = [] } = res
      const count = requesters.length
      const parsedRows = requesters.map((item, index) => {
        const pItem = {
          id: index + 1,
          index: index + 1,
          moniker: item.moniker,
          address: item.requester,
          txHash: item.txHash,
          createdAt: item.createdAt,
        }
        return pItem
      })
      return {
        rows: parsedRows,
        count,
      }
    })
  }

  const goRequesterDetail = (item) => {
    history.push(`/portal/requester/${item.address}`, {
      data: item,
    })
  }

  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={reload}
      fields={[
        { value: "index", label: "#" },
        { value: "moniker", label: "Moniker", action: goRequesterDetail },
        { value: "address", label: "Wallet Addresss", link: openAddress },
        { value: "createdAt", label: "Register Date" },
        { value: "txHash", label: "Tx Hash", link: openTx },
      ]}
      pagination={[15, 25, 40, { label: "All", value: -1 }]}
    />
  )
}

RequesterTable.propTypes = {
  history: PropTypes.object.isRequired,
}

export default App
