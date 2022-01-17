const { serializeError } = require("serialize-error")
const { VORCoordinator } = require("./VORCoordinator")
const {
  NewServiceAgreement,
  ChangeFee,
  ChangeGranularFee,
  RandomnessRequest,
  RandomnessRequestFulfilled,
  NewMoniker,
  StartingDistribute,
  DistributeResult,
} = require("./db/models")
const { XYDistribution } = require("./XYDistribution")

const { WATCH_FROM_BLOCK } = process.env

class ProviderOracle {
  async initOracle() {
    this.VORCoordinator = new VORCoordinator()
    await this.VORCoordinator.initWeb3()
    this.currentBlock = await this.VORCoordinator.getBlockNumber()

    this.newServiceAgreementEvent = "NewServiceAgreement"
    this.changeFeeEvent = "ChangeFee"
    this.changeGranularFeeEvent = "ChangeGranularFee"
    this.randomnessRequestEvent = "RandomnessRequest"
    this.randomnessRequestFulfilledEvent = "RandomnessRequestFulfilled"

    this.fromBlockRequests = WATCH_FROM_BLOCK || this.currentBlock
    this.fromBlockFulfillments = WATCH_FROM_BLOCK || this.currentBlock

    // initialize the XYDistribution contract
    this.XYDistribution = new XYDistribution()
    await this.XYDistribution.initWeb3()

    this.newMonikerEvent = "NewMoniker"
    this.startingDistributeEvent = "StartingDistribute"
    this.distributeResultEvent = "DistributeResult"

    this.fromBlockNewMoniker = WATCH_FROM_BLOCK || this.currentBlock
    this.fromBlockStartingDistribute = WATCH_FROM_BLOCK || this.currentBlock
    this.fromBlockDistributeResult = WATCH_FROM_BLOCK || this.currentBlock

    console.log(new Date(), "current Eth height", this.currentBlock, WATCH_FROM_BLOCK)
  }

  async runOracle() {
    // watching VORCoordinator events
    console.log(new Date(), "watching", this.newServiceAgreementEvent, "from block", this.fromBlockRequests)
    this.watchNewServiceAgreement()
    console.log(new Date(), "watching", this.changeFeeEvent, "from block", this.fromBlockRequests)
    this.watchChangeFee()
    console.log(new Date(), "watching", this.changeGranularFeeEvent, "from block", this.fromBlockRequests)
    this.watchChangeGranularFee()
    console.log(new Date(), "watching", this.randomnessRequestEvent, "from block", this.fromBlockRequests)
    this.watchRandomnessRequest()
    console.log(
      new Date(),
      "watching",
      this.randomnessRequestFulfilledEvent,
      "from block",
      this.fromBlockRequests,
    )
    this.watchRandomnessRequestFulfilled()
    // watching XYDistribution events
    console.log(new Date(), "watching", this.newMonikerEvent, "from block", this.fromBlockNewMoniker)
    this.watchNewMoniker()
    console.log(
      new Date(),
      "watching",
      this.startingDistributeEvent,
      "from block",
      this.fromBlockStartingDistribute,
    )
    this.watchStartingDistribute()
    console.log(
      new Date(),
      "watching",
      this.distributeResultEvent,
      "from block",
      this.fromBlockDistributeResult,
    )
    this.watchDistributeResult()
  }

  /**
   * Watch for NewServiceAgreement events
   *
   * @returns {Promise<void>}
   */
  async watchNewServiceAgreement() {
    console.log(new Date(), "BEGIN watchNewServiceAgreement")
    const self = this
    await this.VORCoordinator.watchEvent(
      this.newServiceAgreementEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchNewServiceAgreement.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { keyHash, fee } = event.returnValues

          const providerAddress = await self.VORCoordinator.getProviderAddress(keyHash)
          const [fr, frCreated] = await NewServiceAgreement.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              keyHash,
              fee,
              publicKey: "",
              providerAddress,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(new Date(), `NewServiceAgreement event created, keyHash ${keyHash} fee ${fee}`)
          } else {
            console.log(
              new Date(),
              `NewServiceAgreement event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }

  /**
   * Watch for ChangeFee events
   *
   * @returns {Promise<void>}
   */
  async watchChangeFee() {
    console.log(new Date(), "BEGIN watchChangeFee")
    const self = this
    await this.VORCoordinator.watchEvent(
      this.changeFeeEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(new Date(), "ERROR watchChangeFee.processEvent for event", self.dataRequestEvent)
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { keyHash, fee } = event.returnValues

          const [fr, frCreated] = await ChangeFee.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              keyHash,
              fee,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(new Date(), `ChangeFee event created, keyHash ${keyHash} fee ${fee}`)
          } else {
            console.log(new Date(), `ChangeFee event already existing on db - txHash: ${transactionHash}`)
          }
        }
      },
    )
  }

  /**
   * Watch for ChangeGranularFee events
   *
   * @returns {Promise<void>}
   */
  async watchChangeGranularFee() {
    console.log(new Date(), "BEGIN watchChangeGranularFee")
    const self = this
    await this.VORCoordinator.watchEvent(
      this.changeGranularFeeEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchChangeGranularFee.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { keyHash, consumer, fee } = event.returnValues

          const [fr, frCreated] = await ChangeGranularFee.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              keyHash,
              consumer,
              fee,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(new Date(), `ChangeGranularFee event created, keyHash ${keyHash} fee ${fee}`)
          } else {
            console.log(
              new Date(),
              `ChangeGranularFee event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }

  /**
   * Watch for RandomnessRequest events
   *
   * @returns {Promise<void>}
   */
  async watchRandomnessRequest() {
    console.log(new Date(), "BEGIN watchRandomnessRequest")
    const self = this
    await this.VORCoordinator.watchEvent(
      this.randomnessRequestEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchRandomnessRequest.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { keyHash, seed, sender, fee, requestID } = event.returnValues
          const [fr, frCreated] = await RandomnessRequest.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              keyHash,
              seed,
              sender,
              fee,
              requestID,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(
              new Date(),
              `RandomnessRequest event created, keyHash ${keyHash} requestID ${requestID}`,
            )
          } else {
            console.log(
              new Date(),
              `RandomnessRequest event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }

  /**
   * Watch for RandomnessRequestFulfilled events
   *
   * @returns {Promise<void>}
   */
  async watchRandomnessRequestFulfilled() {
    console.log(new Date(), "BEGIN watchRandomnessRequestFulfilled")
    const self = this
    await this.VORCoordinator.watchEvent(
      this.randomnessRequestFulfilledEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchRandomnessRequestFulfilled.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { requestId, output } = event.returnValues
          const txRceipt = await self.VORCoordinator.getTransactionReceipt(transactionHash)
          const tx = await self.VORCoordinator.getTransaction(transactionHash)
          console.log(new Date(), "Gas Information", txRceipt.gasUsed, tx.gasPrice)
          const [fr, frCreated] = await RandomnessRequestFulfilled.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              requestID: requestId,
              output,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
              gasUsed: txRceipt.gasUsed,
              gasPrice: tx.gasPrice,
            },
          })
          if (frCreated) {
            console.log(
              new Date(),
              `RandomnessRequestFulfilled event created, output ${output} requestID ${requestId}`,
            )
          } else {
            console.log(
              new Date(),
              `RandomnessRequestFulfilled event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }

  /**
   * Watch for NewMoniker events
   *
   * @returns {Promise<void>}
   */
  async watchNewMoniker() {
    console.log(new Date(), "BEGIN watchNewMoniker")
    const self = this
    await this.XYDistribution.watchEvent(
      this.newMonikerEvent,
      this.fromBlockStartingDistribute,
      async function processEvent(event, err) {
        if (err) {
          console.error(new Date(), "ERROR watchNewMoniker.processEvent for event", self.dataRequestEvent)
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { requester, moniker } = event.returnValues
          const [fr, frCreated] = await NewMoniker.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              requester,
              moniker,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(new Date(), `NewMoniker event created, requester ${requester}, moniker ${moniker}`)
          } else {
            console.log(new Date(), `NewMoniker event already existing on db - txHash: ${transactionHash}`)
          }
        }
      },
    )
  }

  /**
   * Watch for StartingDistribute events
   *
   * @returns {Promise<void>}
   */
  async watchStartingDistribute() {
    console.log(new Date(), "BEGIN watchStartingDistribute")
    const self = this
    await this.XYDistribution.watchEvent(
      this.startingDistributeEvent,
      this.fromBlockStartingDistribute,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchStartingDistribute.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { distID, requestID, ipfs, sourceCount, destCount, dataType, keyHash, seed, sender, fee } =
            event.returnValues
          const [fr, frCreated] = await StartingDistribute.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              distID,
              requestID,
              ipfs,
              sourceCount,
              destCount,
              dataType,
              keyHash,
              seed,
              sender,
              fee,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })

          if (frCreated) {
            console.log(
              new Date(),
              `StartingDistribute event created, keyHash ${keyHash} requestID ${requestID} distributeID ${distID}`,
            )
          } else {
            console.log(
              new Date(),
              `StartingDistribute event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }

  /**
   * Watch for DistributeResult events
   *
   * @returns {Promise<void>}
   */
  async watchDistributeResult() {
    console.log(new Date(), "BEGIN watchDistributeResult")
    const self = this
    await this.XYDistribution.watchEvent(
      this.distributeResultEvent,
      this.fromBlockRequests,
      async function processEvent(event, err) {
        if (err) {
          console.error(
            new Date(),
            "ERROR watchDistributeResult.processEvent for event",
            self.dataRequestEvent,
          )
          console.error(JSON.stringify(serializeError(err), null, 2))
        } else {
          const { transactionHash, transactionIndex, blockNumber, blockHash } = event
          const { distID, requestID, sender, beginIndex, sourceCount, destCount, dataType } =
            event.returnValues
          const [fr, frCreated] = await DistributeResult.findOrCreate({
            where: {
              txHash: transactionHash,
            },
            defaults: {
              distID,
              requestID,
              sender,
              beginIndex,
              sourceCount,
              destCount,
              dataType,
              blockNumber,
              blockHash,
              txHash: transactionHash,
              txIndex: transactionIndex,
            },
          })
          if (frCreated) {
            console.log(
              new Date(),
              `DistributeResult event created, output ${beginIndex} requestID ${requestID} distributionID ${distID}`,
            )
          } else {
            console.log(
              new Date(),
              `DistributeResult event already existing on db - txHash: ${transactionHash}`,
            )
          }
        }
      },
    )
  }
}

module.exports = {
  ProviderOracle,
}
