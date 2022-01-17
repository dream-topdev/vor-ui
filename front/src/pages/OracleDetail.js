import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import VisibilityIcon from "@material-ui/icons/Visibility"
import { useHistory } from "react-router"
import CustomPaginationActionsTable from "../components/PaginationTable"
import { getRequests, getOracleSummary, getOracleFeeHistory } from "../api"
import { convertWeiToEth, convertWeiToGwei, openAddress, openTx, toXFund } from "../utils/common"

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 10,
  },
  table: {
    minWidth: 650,
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
    [theme.breakpoints.down("sm")]: {
      flexWrap: "nowrap",
      flexDirection: "column",
      wordBreak: "break-all",
      padding: "10px 15px",
    },
    [theme.breakpoints.up("sm")]: {
      flexWrap: "wrap",
      flexDirection: "row",
      wordBreak: "normal",
      padding: "20px 30px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "32px 48px",
    },
  },
  separator: {
    borderRight: "1px solid rgba(128, 128, 128, 0.25)",
    height: "100px",
    marginRight: "48px",
    marginLeft: "48px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  overviewCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      borderBottom: "1px solid lightgray",
      marginBottom: 10,
      "&:last-child": {
        borderBottom: "none",
        marginBottom: "none",
      },
    },
    [theme.breakpoints.up("sm")]: {
      borderBottom: "none",
      marginBottom: 0,
    },
  },
}))

function RequestTable({ keyHash, history }) {
  const loadData = (page, rowsPerPage) => {
    return getRequests(keyHash, page, rowsPerPage).then((res) => {
      const { requests } = res
      const { count, rows } = requests
      const parsedRows = rows.map((item, index) => {
        const pItem = {
          id: item.requestID,
          index: index + 1,
          requestID: item.requestID,
          status: item.RandomnessRequestFulfilled ? "Fulfilled" : "Request",
          output: item.RandomnessRequestFulfilled ? item.RandomnessRequestFulfilled.output : "",
          requestTxHash: item.txHash,
          requestFee: toXFund(item.fee),
          fulfilledTxHash: item.RandomnessRequestFulfilled ? item.RandomnessRequestFulfilled.txHash : "",
          fulfilledGasUsed: item.RandomnessRequestFulfilled ? item.RandomnessRequestFulfilled.gasUsed : "",
          fulfilledGasPrice: item.RandomnessRequestFulfilled
            ? convertWeiToGwei(item.RandomnessRequestFulfilled.gasPrice)
            : "",
        }
        return pItem
      })
      return {
        rows: parsedRows,
        count,
      }
    })
  }

  const goRequestDetail = (item) => {
    history.push(`/request/${item.requestID}`, {
      data: item,
    })
  }

  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={true}
      fields={[
        { value: "index", label: "#" },
        { action: goRequestDetail, icon: <VisibilityIcon />, label: "Action" },
        { value: "requestID", label: "Request ID" },
        { value: "status", label: "Status" },
        { value: "output", label: "Random Value" },
        { value: "requestTxHash", label: "Request TX Hash", link: openTx },
        { value: "requestFee", label: "Request Fee" },
        { value: "fulfilledTxHash", label: "Fulfilled TX Hash", link: openTx },
        { value: "fulfilledGasUsed", label: "Fulfilled Gas Used" },
        { value: "fulfilledGasPrice", label: "Fulfilled Gas Price" },
      ]}
    />
  )
}

RequestTable.propTypes = {
  keyHash: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

function FeeTable({ keyHash }) {
  const [feeList, setFees] = useState([])
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    getOracleFeeHistory(keyHash).then((res) => {
      const { fees, granularFees } = res
      let rows = fees.concat(granularFees)
      rows = rows.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
      rows = rows.map((item, index) => ({
        id: item.txHash,
        index: index + 1,
        type: item.consumer ? "Granular" : "Global",
        fee: toXFund(item.fee),
        consumer: item.consumer ? item.consumer : "",
        time: item.createdAt,
      }))
      setFees(rows)
      setLoaded(true)
    })
  }, [])
  const loadData = (page, rowsPerPage) => {
    return Promise.resolve({
      rows: feeList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
      count: feeList.length,
    })
  }

  return (
    <CustomPaginationActionsTable
      loadData={loadData}
      fullLoaded={loaded}
      fields={[
        { value: "index", label: "#" },
        { value: "type", label: "Type" },
        { value: "fee", label: "Fee" },
        { value: "consumer", label: "Consumer Address", link: openAddress },
        { value: "time", label: "Time" },
      ]}
    />
  )
}

FeeTable.propTypes = {
  keyHash: PropTypes.string.isRequired,
}

function OracleDetail() {
  const [count, setRequestCount] = useState({
    requestCount: 0,
    fulfilledCount: 0,
    xFundEarned: 0,
    gasPaid: 0,
    wallet: "",
  })
  const history = useHistory()
  const keyHash = history.location.pathname.split("/").reverse()[0]
  const classes = useStyles()

  useEffect(() => {
    getOracleSummary(keyHash).then((res) => {
      setRequestCount(res)
    })
  }, [])

  return (
    <div className={classes.container}>
      <Paper elevation={1} className={classes.overviewContainer}>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Key Hash</Typography>
          <Typography variant="subtitle1">{keyHash}</Typography>
          <Typography variant="h6">Wallet Address</Typography>
          <Typography variant="subtitle1">{count.wallet}</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Requests</Typography>
          <Typography variant="subtitle1">{count.requestCount}</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Fulfilled</Typography>
          <Typography variant="subtitle1">{count.fulfilledCount}</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Total xFund Fee Earned</Typography>
          <Typography variant="subtitle1">{toXFund(count.xFundEarned)}&nbsp;xFund</Typography>
        </div>
        <div className={classes.separator}></div>
        <div className={classes.overviewCard}>
          <Typography variant="h6">Total Gas Paid</Typography>
          <Typography variant="subtitle1">{convertWeiToEth(count.gasPaid)}&nbsp;ETH</Typography>
        </div>
      </Paper>
      <div className={classes.wrapper}>
        <RequestTable keyHash={keyHash} history={history} />
      </div>
      <div className={classes.wrapper}>
        <FeeTable keyHash={keyHash} />
      </div>
    </div>
  )
}

export default OracleDetail
