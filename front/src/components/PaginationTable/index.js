import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import FirstPageIcon from "@material-ui/icons/FirstPage"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import LastPageIcon from "@material-ui/icons/LastPage"
import { Button, Container, withWidth } from "@material-ui/core"
import StyledTableCell from "../Table/StyledTableCell"
import { addPopup, sliceString, StyledTooltip } from "../../utils/common"
import listStyles from "../../styles/listStyles"

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}))

function TablePaginationActions(props) {
  const classes = useStyles1()
  const theme = useTheme()
  const { count, page, rowsPerPage, onChangePage } = props

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  }

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  return (
    <div className={classes.root}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  )
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
}

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  loadMoreBtn: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 19,
    lineHeight: "28px",
    color: "#8D8D8D",
  },
})

// const StyledTableCell = withStyles((theme) => ({
//   root: {
//     height: 35,
//     padding: 0,
//     fontFamily: "Poppins, sans-serif",
//     fontStyle: "normal",
//     fontWeight: "normal",
//     padding: "0 10px",
//     textAlign: "center",
//   },
//   head: {
//     backgroundColor: "#363435",
//     height: 35,
//     paddingTop: 3,
//     whiteSpace: "nowrap",
//     fontSize: 21,
//     lineHeight: "31px",
//     color: "#FFFFFF",
//     "&:first-child": {
//       borderRadius: "10px 0 0 10px",
//     },
//     "&:last-child": {
//       borderRadius: "0 10px 10px 0",
//     },
//   },
//   body: {
//     fontSize: 14,
//     height: 64,
//     // max-width: 100px,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "nowrap",
//   },
// }))(TableCell)

function CustomPaginationActionsTable({ fields, loadData, fullLoaded, pagination, width }) {
  const classes = useStyles2()
  const listClasses = listStyles()
  const [page] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(pagination ? pagination[0] : 5)
  const [rows, setRows] = React.useState([])
  const [, setCount] = React.useState(0)
  const [emptyRows, setEmptyRows] = React.useState(0)

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage)
  // }
  //
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10))
  //   setPage(0)
  // }
  const refreshData = () => {
    loadData(page, rowsPerPage).then((res) => {
      setRows(res.rows)
      setCount(res.count)
      setEmptyRows(rowsPerPage - Math.min(rowsPerPage, res.count - page * rowsPerPage))
    })
  }
  useEffect(() => {
    if (fullLoaded) refreshData()
  }, [page, rowsPerPage])

  useEffect(() => {
    if (fullLoaded) refreshData()
  }, [fullLoaded])

  return (
    <>
      {width === "xs" ? (
        <Container className={listClasses.container}>
          {rows.map((row) => (
            <ul key={row.id} className={listClasses.ul}>
              <li className={listClasses.header}>
                <span>#{row.index} </span>
                <span className="keyHash">{addPopup(row.keyHash)} </span>
                <span className={row.status}>{row.status}</span>
              </li>
              {fields.map((item) =>
                !row[item.value] ||
                item.value === "index" ||
                item.value === "keyHash" ||
                item.value === "status" ? null : (
                  <li key={item.label} className={listClasses.li}>
                    <b>{item.label} </b>
                    {!item.action && item.link ? (
                      <StyledTooltip title={row[item.value]} placement="top">
                        <a
                          className="cellLink"
                          href={item.link(row[item.value])}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {sliceString(row[item.value], item.label.length)}
                        </a>
                      </StyledTooltip>
                    ) : (
                      addPopup(!item.action && row[item.value], item.label.length)
                    )}
                    {item.action &&
                      (item.icon ? (
                        <IconButton onClick={() => item.action(row)}>{item.icon}</IconButton>
                      ) : (
                        <StyledTooltip title={row[item.value]} placement="top">
                          <a
                            className="cellLink"
                            href=""
                            onClick={(e) => {
                              e.preventDefault()
                              item.action(row)
                            }}
                          >
                            {sliceString(row[item.value], item.label.length)}
                          </a>
                        </StyledTooltip>
                      ))}
                  </li>
                ),
              )}
            </ul>
          ))}
        </Container>
      ) : (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                {fields.map((item) => (
                  <StyledTableCell key={item.label}>{item.label}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {fields.map((item) => (
                    <StyledTableCell key={item.label} component="th" scope="row">
                      {!item.action && item.link ? (
                        <StyledTooltip title={row[item.value]} placement="top">
                          <a
                            className="cellLink"
                            href={item.link(row[item.value])}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {sliceString(row[item.value], item.label.length)}
                          </a>
                        </StyledTooltip>
                      ) : (
                        addPopup(!item.action && row[item.value], item.label.length)
                      )}
                      {item.action &&
                        (item.icon ? (
                          <IconButton onClick={() => item.action(row)}>{item.icon}</IconButton>
                        ) : (
                          <StyledTooltip title={row[item.value]} placement="top">
                            <a
                              className="cellLink"
                              href=""
                              onClick={(e) => {
                                e.preventDefault()
                                item.action(row)
                              }}
                            >
                              {sliceString(row[item.value], item.label.length)}
                            </a>
                          </StyledTooltip>
                        ))}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={fields.length} />
                </TableRow>
              )}
            </TableBody>
            {/* <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={pagination || [5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter> */}
          </Table>
        </TableContainer>
      )}
      <p>
        <Button
          className={classes.loadMoreBtn}
          onClick={() => {
            setRowsPerPage(rows.length + 10)
          }}
        >
          Load More
        </Button>
      </p>
    </>
  )
}

CustomPaginationActionsTable.propTypes = {
  fields: PropTypes.array.isRequired,
  loadData: PropTypes.func.isRequired,
  fullLoaded: PropTypes.number.isRequired,
  pagination: PropTypes.array,
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired,
}

export default withWidth()(CustomPaginationActionsTable)
