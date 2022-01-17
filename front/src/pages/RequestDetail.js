import React, { useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { useLocation } from "react-router-dom"
import { getRequestDetail } from "../api"
import { ETHERSCAN_URL } from "../utils/Constants"
import { toXFund } from "../utils/common"

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
  useEffect(() => {
    getRequestDetail(id).then((res) => {
      if (!res) return
      setRequest({
        keyHash: res.keyHash,
        status: res.RandomnessRequestFulfilled ? "Fulfilled" : "Request",
        requestID: res.requestID,
        fee: toXFund(res.fee),
        seed: res.seed,
        sender: res.sender,
        requestBlockNo: res.blockNumber,
        requestTxHash: res.txHash,
        fulfilledBlockNo: res.RandomnessRequestFulfilled ? res.RandomnessRequestFulfilled.blockNumber : "",
        fulfilledTxHash: res.RandomnessRequestFulfilled ? res.RandomnessRequestFulfilled.txHash : "",
        output: res.RandomnessRequestFulfilled ? res.RandomnessRequestFulfilled.output : "N/A",
      })
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
          <Typography variant="subtitle1">{request.requestID}</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Fee</Typography>
          <Typography variant="subtitle1">{request.fee}</Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Random Value</Typography>
          <Typography variant="subtitle1">
            {request.fulfilledTxHash ? (
              <a
                href={`${ETHERSCAN_URL}/tx/${request.fulfilledTxHash}#eventlog`}
                target="_blank"
                rel="noreferrer"
              >
                {request.output}
              </a>
            ) : (
              request.output
            )}
          </Typography>
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
          <Typography variant="h6">Request Block #</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/block/${request.requestBlockNo}`} target="_blank" rel="noreferrer">
              {request.requestBlockNo}
            </a>
          </Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Request Tx Hash</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/tx/${request.requestTxHash}`} target="_blank" rel="noreferrer">
              {request.requestTxHash}
            </a>
          </Typography>
        </div>
      </Paper>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Fulfilled Block #</Typography>
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
          <Typography variant="h6">Fulfilled Tx Hash</Typography>
          <Typography variant="subtitle1">
            <a href={`${ETHERSCAN_URL}/tx/${request.fulfilledTxHash}`} target="_blank" rel="noreferrer">
              {request.fulfilledTxHash}
            </a>
          </Typography>
        </div>
      </Paper>
    </div>
  )
}

export default RequestDetail
