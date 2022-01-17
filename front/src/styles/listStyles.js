import { makeStyles } from "@material-ui/core"

const listStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    padding: 0,
  },
  ul: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#ffffff",
    borderRadius: 10,
  },
  header: {
    backgroundColor: "#363435",
    whiteSpace: "nowrap",
    fontSize: 21,
    padding: "5px 10px 5px 20px",
    color: "#FFFFFF",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  visibilityIcon: {
    "& > svg": {
      color: "#ffffff",
    },
  },
  keyHash: {
    color: "#FF0007",
  },
  li: {
    textAlign: "left",
    fontSize: 21,
    padding: "5px 10px 5px 20px",
    borderBottom: "1px solid #F1F2F6",
    "&:first-child": {
      marginTop: 5,
    },
    "&:last-child": {
      borderBottom: "none",
      marginBottom: 10,
    },
  },
}))

export default listStyles
