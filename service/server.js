const express = require("express")
const formidableMiddleware = require("express-formidable")
const cors = require("cors")
require("dotenv").config()

const app = express()
const { appRoute } = require("./routes")

const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
}

app.use(cors(corsOptions))

app.use(formidableMiddleware())

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to VOR UI application." })
})

app.use("/", appRoute)

const startServer = () => {
  // set port, listen for requests
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
  })
}
module.exports = {
  startServer,
}
