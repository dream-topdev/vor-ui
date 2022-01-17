import React from "react"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { withStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"

const styles = {
  root: {
    marginLeft: 5,
  },
}
const SpinnerAdornment = withStyles(styles)((props) => (
  <CircularProgress className={props.classes.spinner} size={20} color="secondary" />
))
const LoadingButton = (props) => {
  const { children, loading, disabled, ...rest } = props
  return (
    <Button {...rest} disabled={disabled || loading}>
      {!loading && children}
      {loading && <SpinnerAdornment {...rest} />}
    </Button>
  )
}

LoadingButton.propTypes = {
  children: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
}

export default LoadingButton
