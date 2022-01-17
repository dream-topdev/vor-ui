import { withStyles } from "@material-ui/core/styles"
import TableRow from "@material-ui/core/TableRow"

const StyledTableRow = withStyles(() => ({
  root: {
    height: "35px",
    // "&:nth-of-type(odd)": {
    //   backgroundColor: theme.palette.action.hover,
    // },
  },
  head: {
    borderRadius: 10,
  },
}))(TableRow)

export default StyledTableRow
