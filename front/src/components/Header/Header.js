import { makeStyles } from "@material-ui/core"
import React from "react"

const useStyles = makeStyles((theme) => ({
  header: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginBottom: 0,
    },
    [theme.breakpoints.up("sm")]: {
      marginBottom: 80,
    },
  },
  logo: {
    width: "100%",
    maxWidth: 768,
    margin: "auto",
  },
  subHeader: {
    position: "absolute",
    top: "75%",
    fontSize: "4vmin",
    color: "#8F8F8F",
  },
}))

const Header = () => {
  const classes = useStyles()
  return (
    <div className={classes.header}>
      <img src="VOR Logo Black.png" className={classes.logo} />
      <span className={classes.subHeader}>Powered by Unification</span>
    </div>
  )
}
export default Header
