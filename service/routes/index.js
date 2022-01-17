const { Router } = require("express")
const apiRoute = require("./api")
const portalRoute = require("./portal")

const appRoute = Router()

appRoute.use("/api", apiRoute)
appRoute.use("/portal", portalRoute)

module.exports = {
  appRoute,
}
