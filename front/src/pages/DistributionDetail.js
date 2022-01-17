import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { useLocation } from "react-router-dom"
import JSONPretty from "react-json-pretty"
import PropTypes from "prop-types"
import { getDataFromIPFS, getDistDetail } from "../api"
import { ETHERSCAN_URL, IPFS_URL, ONE_TO_ONE_MAPPING } from "../utils/Constants"
import { toXFund } from "../utils/common"
import "react-json-pretty/themes/monikai.css"
import CustomPaginationActionsTable from "../components/PaginationTable"

const useStyles = makeStyles({
  container: {
    padding: 10,
  },
  wrapper: {
    marginTop: 30,
  },
  overviewContainer: {
    padding: "32px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  separator: {
    borderRight: "1px solid rgba(128, 128, 128, 0.25)",
    height: "100px",
    marginRight: "48px",
    marginLeft: "48px",
  },
  overviewCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
  },
})

function RequestDetail() {
  const classes = useStyles()
  const location = useLocation()
  const id = location.pathname.split("/").reverse()[0]
  const [request, setRequest] = useState({
    keyHash: "",
    status: "",
    requestID: "",
    fee: "",
    seed: "",
    sender: "",
    requestBlockNo: "",
    requestBlockHash: "",
    fulfilledBlockNo: "",
    fulfilledBlockHash: "",
  })
  const [ipfs, setIPFS] = useState({})

  const loadIPFS = (_ipfs) => {
    getDataFromIPFS(_ipfs).then((res) => {
      console.log(res)
      setIPFS(res)
    })
  }

  useEffect(() => {
    getDistDetail(id).then((res) => {
      if (!res) return
      const { requester, request: req } = res
      setRequest({
        keyHash: req.keyHash,
        status: req.DistributeResult ? "Distributed" : "Request",
        requestID: req.requestID,
        distID: req.distID,
        fee: toXFund(req.fee),
        seed: req.seed,
        sender: req.sender,
        moniker: requester.moniker,
        requestBlockNo: req.blockNumber,
        requestTxHash: req.txHash,
        fulfilledBlockNo: req.DistributeResult ? req.DistributeResult.blockNumber : "",
        fulfilledTxHash: req.DistributeResult ? req.DistributeResult.txHash : "",
        beginIndex: req.DistributeResult ? req.DistributeResult.beginIndex : "N/A",
        ipfs: req.ipfs,
      })
      loadIPFS(req.ipfs)
    })
  }, [])

  return (
    <div className={classes.container}>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Key Hash</Typography>
          <Typography variant="subtitle1">
            <a href={`/${request.keyHash}`} rel="noreferrer">
              {request.keyHash}
            </a>
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Status</Typography>
          <Typography variant="subtitle1">{request.status}</Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Request ID</Typography>
          <Typography variant="subtitle1">
            <a href={`/request/${request.requestID}`} target="_blank" rel="noreferrer">
              {request.requestID}
            </a>
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Fee</Typography>
          <Typography variant="subtitle1">{request.fee}</Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Random Value(Begin Index)</Typography>
          <Typography variant="subtitle1">
            {request.fulfilledTxHash ? (
              <a
                href={`${ETHERSCAN_URL}/tx/${request.fulfilledTxHash}#eventlog`}
                target="_blank"
                rel="noreferrer"
              >
                {request.beginIndex}
              </a>
            ) : (
              request.beginIndex
            )}
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Distribution ID</Typography>
          <Typography variant="subtitle1">{request.distID}</Typography>
        </div>
      </Paper>

      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Moniker</Typography>
          <Typography variant="subtitle1">{request.moniker}</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Sender</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/address/${request.sender}`} target="_blank" rel="noreferrer">
              {request.sender}
            </a>
          </Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">StartingDistribute Block #</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/block/${request.requestBlockNo}`} target="_blank" rel="noreferrer">
              {request.requestBlockNo}
            </a>
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">StartingDistribute Tx Hash</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/tx/${request.requestTxHash}`} target="_blank" rel="noreferrer">
              {request.requestTxHash}
            </a>
          </Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">DistributedResult Block #</Typography>
          <Typography variant="subtitle1">
            {request.fulfilledBlockNo ? (
              <a href={`${ETHERSCAN_URL}/block/${request.fulfilledBlockNo}`} target="_blank" rel="noreferrer">
                {request.fulfilledBlockNo}
              </a>
            ) : (
              request.fulfilledBlockNo
            )}
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">DistributedResult Tx Hash</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/tx/${request.fulfilledTxHash}`} target="_blank" rel="noreferrer">
              {request.fulfilledTxHash}
            </a>
          </Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">IPFS</Typography>
          <Typography variant="subtitle1">
            <a href={`${IPFS_URL}/${request.ipfs}`} target="_blank" rel="noreferrer">
              {request.ipfs}
            </a>
          </Typography>
        </div>
      </Paper>
      <div style={{ marginBottom: 20 }}>
        <JSONPretty
          id="json-pretty"
          data={ipfs}
          style={{ textAlign: "left" }}
          mainStyle={"height: 200px"}
        ></JSONPretty>
      </div>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Formatted Result</Typography>
        </div>
      </Paper>
      {ipfs.type === ONE_TO_ONE_MAPPING ? (
        <OneToOneTable ipfs={ipfs} beginIndex={parseInt(request.beginIndex, 10)} />
      ) : (
        <XFromYTable ipfs={ipfs} beginIndex={parseInt(request.beginIndex, 10)} />
      )}
    </div>
  )
}

function OneToOneTable({ ipfs, beginIndex }) {
  const [reload, setReload] = useState(1)
  const loadData = () => {
    return new Promise((resolve) => {
      const parsedRows = []
      console.log(beginIndex)
      for (let i = 0; i < ipfs.num_sources; i += 1) {
        parsedRows.push({
          id: i + 1,
          index: i + 1,
          source: ipfs.sources[i],
          target: ipfs.target[(i + beginIndex) % ipfs.num_sources],
        })
      }
      resolve({
        rows: parsedRows,
        count: parsedRows.length,
      })
    })
  }

  useEffect(() => {
    setReload(reload + 1)
  }, [ipfs])
  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={reload}
      fields={[
        { value: "index", label: "#" },
        { value: "source", label: "Source" },
        { value: "target", label: "Target" },
      ]}
      pagination={[15, 25, 40, { label: "All", value: -1 }]}
    />
  )
}

OneToOneTable.propTypes = {
  ipfs: PropTypes.object.isRequired,
  beginIndex: PropTypes.number.isRequired,
}

function XFromYTable({ ipfs, beginIndex }) {
  const [reload, setReload] = useState(1)
  const loadData = () => {
    return new Promise((resolve) => {
      const parsedRows = []
      for (let i = 0; i < ipfs.num_selections; i += 1) {
        parsedRows.push({
          id: i + 1,
          index: i + 1,
          source: ipfs.sources[(i + beginIndex) % ipfs.num_sources],
        })
      }
      resolve({
        rows: parsedRows,
        count: parsedRows.length,
      })
    })
  }

  useEffect(() => {
    setReload(reload + 1)
  }, [ipfs])
  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={reload}
      fields={[
        { value: "index", label: "#" },
        { value: "source", label: "Source" },
      ]}
      pagination={[15, 25, 40, { label: "All", value: -1 }]}
    />
  )
}

XFromYTable.propTypes = {
  ipfs: PropTypes.object.isRequired,
  beginIndex: PropTypes.number.isRequired,
}

export default RequestDetail
