import { makeStyles } from "@material-ui/core"
import React from "react"
import { Link } from "react-router-dom"

const useStyle = makeStyles((theme) => ({
  nav: {
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      margin: "7vmin 0",
      textAlign: "center",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "10px 20px 0",
      margin: 0,
      textAlign: "right",
    },
  },
  naLink: {
    fontFamily: "Poppins, sans-serif",
    fontWeight: "normal",
    fontSize: 15,
    margin: "5px 11px",
    textDecoration: "none",
    color: "#000000",
    cursor: "pointer",
    "&:hover": {
      color: "#1D1C57",
      borderBottom: "2px solid #1D1C57",
    },
  },
  active: {
    fontWeight: 600,
    color: "#1D1C57",
    borderBottom: "2px solid #1D1C57",
  },
}))
const TopNav = () => {
  const classes = useStyle()
  return (
    <nav className={classes.nav}>
      <Link className={`${classes.naLink} ${classes.active}`} underline="none" to="#">
        Explore
      </Link>
      <Link className={`${classes.naLink}`} underline="none" to="#">
        Docs
      </Link>
    </nav>
  )
}
export default TopNav
