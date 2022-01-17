import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import { useHistory } from "react-router"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { getDistRequests, getDistRequester } from "../api"
import { openIPFS, openTx, toXFund } from "../utils/common"
import CustomPaginationActionsTable from "../components/PaginationTable"

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
  overviewContainer: {
    padding: "32px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    borderRadius: "10px",
    marginBottom: 10,
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

function App() {
  const classes = useStyles()
  const history = useHistory()
  const [address, setAddress] = useState(null)
  const [moniker, setMonicker] = useState(null)
  const [reqCount, setReqCount] = useState(0)
  const [fulfilledCount, setFulfilledCount] = useState(0)
  const requesterAddress = history.location.pathname.split("/").reverse()[0]

  useEffect(() => {
    getDistRequester(requesterAddress).then((res) => {
      setAddress(res.requester.requester)
      setMonicker(res.requester.moniker)
      setReqCount(res.requestCount)
      setFulfilledCount(res.fulfilledCount)
      console.log(res)
    })
  }, [])

  return (
    <div className={classes.container}>
      <div>
        <Paper elevation={1} className={classes.overviewContainer}>
          <div className={classes.overviewCard}>
            <Typography variant="h6">Wallet Address</Typography>
            <Typography variant="subtitle1">{address}</Typography>
          </div>
          <div className={classes.separator}></div>
          <div className={classes.overviewCard}>
            <Typography variant="h6">Moniker</Typography>
            <Typography variant="subtitle1">{moniker}</Typography>
          </div>
          <div className={classes.separator}></div>
          <div className={classes.overviewCard}>
            <Typography variant="h6">Requests Made</Typography>
            <Typography variant="subtitle1">{reqCount}</Typography>
          </div>
          <div className={classes.separator}></div>
          <div className={classes.overviewCard}>
            <Typography variant="h6">Success Requests</Typography>
            <Typography variant="subtitle1">{fulfilledCount}</Typography>
          </div>
        </Paper>
        <RequestTable address={requesterAddress} history={history} />
      </div>
    </div>
  )
}

function RequestTable({ address, history }) {
  const [reload] = useState(1)
  const loadData = (page, rowsPerPage) => {
    return getDistRequests(address, page, rowsPerPage).then((res) => {
      const { requests } = res
      const { count, rows } = requests
      const parsedRows = rows.map((item, index) => {
        const pItem = {
          id: item.requestID,
          index: index + 1,
          keyHash: item.keyHash,
          requestID: item.requestID,
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
  const goOracleDetail = (item) => {
    history.push(`/${item.keyHash}`, {
      data: item,
    })
  }

  const goRequestDetail = (item) => {
    history.push(`/request/${item.requestID}`, {
      data: item,
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
        { value: "keyHash", label: "Key Hash", action: goOracleDetail },
        { value: "requestID", label: "Request ID", action: goRequestDetail },
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

export default App
