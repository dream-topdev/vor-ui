require("dotenv").config()
const Web3 = require("web3")
const Web3WsProvider = require("web3-providers-ws")

const { VORCoordinatorABI } = require("../front/src/abis/abis")

const { REACT_APP_VORCOORDINATOR_ADDRESS, REACT_APP_WEB3_PROVIDER_HTTP, REACT_APP_WEB3_PROVIDER_WS } = process.env

class VORCoordinator {
  async initWeb3() {
    console.log(new Date(), "init contractHttp")
    this.web3Http = await new Web3(REACT_APP_WEB3_PROVIDER_HTTP)
    this.contractHttp = await new this.web3Http.eth.Contract(
      VORCoordinatorABI,
      REACT_APP_VORCOORDINATOR_ADDRESS,
    )

    console.log(new Date(), "init contractWs")

    const wsOptions = {
      timeout: 30000, // ms
      clientConfig: {
        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 60000, // ms
      },

      // Enable auto reconnection
      reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: false,
      },
    }

    console.log(new Date(), "wsOptions", wsOptions)

    this.providerWs = new Web3WsProvider(REACT_APP_WEB3_PROVIDER_WS, wsOptions)
    this.web3Ws = new Web3(this.providerWs)
    this.contractWs = await new this.web3Ws.eth.Contract(VORCoordinatorABI, REACT_APP_VORCOORDINATOR_ADDRESS)
    console.log("Web3 initialised")
  }

  setCurrentBlock(height) {
    this.currentBlock = parseInt(height, 10)
  }

  async getProviderAddress(keyHash) {
    return new Promise((resolve, reject) => {
      this.contractHttp.methods.getProviderAddress(keyHash).call(function onCall(error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  async watchBlocks(cb = function () {}) {
    console.log(new Date(), "running block watcher")
    const self = this
    this.web3Ws.eth
      .subscribe("newBlockHeaders")
      .on("connected", function newBlockHeadersConnected(subscriptionId) {
        console.log(new Date(), "watchBlocks newBlockHeaders connected", subscriptionId)
      })
      .on("data", function newBlockHeadersRecieved(blockHeader) {
        console.log(new Date(), "watchBlocks got block", blockHeader.number)
        self.setCurrentBlock(blockHeader.number)
        cb(blockHeader, null)
      })
      .on("error", function newBlockHeadersError(error) {
        cb(null, error)
      })
  }

  async watchEvent(eventName, fromBlock = 0, cb = function () {}) {
    console.log(new Date(), "running watcher for", eventName)

    this.contractWs.events[eventName]({
      fromBlock,
    })
      .on("connected", function onWatchEventConnected(subscriptionId) {
        console.log(new Date(), "watchEvent", eventName, "connected", subscriptionId)
      })
      .on("data", async function onWatchEvent(event) {
        cb(event, null)
      })
      .on("error", function onWatchEventError(error) {
        cb(null, error)
      })
  }

  async getBlockNumber() {
    return this.web3Http.eth.getBlockNumber()
  }

  async getTransactionReceipt(txHash) {
    return this.web3Http.eth.getTransactionReceipt(txHash)
  }

  async getTransaction(txHash) {
    return this.web3Http.eth.getTransaction(txHash)
  }

  async getPastEvents(fromBlock, toBlock, eventName, cb = function () {}) {
    await this.contractHttp.getPastEvents(
      eventName,
      {
        fromBlock,
        toBlock,
      },
      function onGotEvents(error, events) {
        cb(events, error)
      },
    )
  }

  async searchEventsForRequest(fromBlock, toBlock, eventName, requestId) {
    return new Promise((resolve, reject) => {
      this.contractHttp.getPastEvents(
        eventName,
        {
          fromBlock,
          toBlock,
          filter: { requestId },
        },
        function onGotEvents(error, events) {
          if (error) {
            reject(error)
          } else {
            resolve(events)
          }
        },
      )
    })
  }
}

module.exports = {
  VORCoordinator,
}
