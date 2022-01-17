require("dotenv").config()
const arg = require("arg")
const { ProviderOracle } = require("./oracle")
const { startServer } = require("./server")

const env = process.env.NODE_ENV || "development"

const args = arg({
  // Types
  "--run": String,
  "--event": String,
  "--test": String,

  // Aliases
  "-r": "--run",
  "-e": "--event",
})

console.log(new Date(), "running in", env)
const run = async () => {
  const runWhat = args["--run"]
  const oracle = new ProviderOracle()

  switch (runWhat) {
    case "run-oracle":
      await oracle.initOracle()
      await oracle.runOracle()
      startServer()
      break
    case "run-server":
      startServer()
      break
    default:
      console.log(new Date(), "nothing to do")
      process.exit(0)
      break
  }
}

run()
