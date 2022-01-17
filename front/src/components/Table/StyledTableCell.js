import { withStyles } from "@material-ui/core/styles"
import TableCell from "@material-ui/core/TableCell"

const StyledTableCell = withStyles(() => ({
  root: {
    height: 35,
    fontFamily: "Poppins, sans-serif",
    fontStyle: "normal",
    fontWeight: "normal",
    padding: "3px 15px 0",
    textAlign: "center",
    "&:first-child": {
      // padding: "3px 10px 0",
    },
  },
  head: {
    backgroundColor: "#363435",
    height: 35,
    paddingTop: 3,
    whiteSpace: "nowrap",
    fontSize: 21,
    lineHeight: "31px",
    color: "#FFFFFF",
    "&:first-child": {
      borderRadius: "10px 0 0 10px",
      width: 30,
      // paddingRight: 0,
    },
    "&:last-child": {
      borderRadius: "0 10px 10px 0",
    },
  },
  body: {
    fontWeight: "500",
    fontSize: "17px",
    lineHeight: "25px",
    height: "64px",
    paddingTop: 26,
    paddingBottom: 12,
    overflow: "visible",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
}))(TableCell)

export default StyledTableCell
