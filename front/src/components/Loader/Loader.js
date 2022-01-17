import React from "react"
import "./Loader.css"

const Loader = () => {
  return (
    <div className="spinnerContainer d-flex justify-content-center align-items-center h-100">
      <div className="spinner-border text-primary" role="status">
        <div className="sr-only">Loading</div>
      </div>
    </div>
  )
}

export default Loader
