require("dotenv").config()

const XYDistribution = artifacts.require("XYDistribution")
const { MockERC20ABI, VORCoordinatorABI } = require("../front/src/abis/abis")

const { REACT_APP_XFUND_ADDRESS, REACT_APP_VORCOORDINATOR_ADDRESS, KEY_HASH } = process.env
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async function (callback) {
  const newtworkType = await web3.eth.net.getNetworkType()
  if (newtworkType !== "private") {
    console.log("run with Ganache")
    process.exit(1)
  }

  const accounts = await web3.eth.getAccounts()
  const xfund = await new web3.eth.Contract(MockERC20ABI, REACT_APP_XFUND_ADDRESS)
  const vorCoord = await new web3.eth.Contract(VORCoordinatorABI, REACT_APP_VORCOORDINATOR_ADDRESS)
  const consumerOwner = accounts[0]
  const provider = accounts[1]
  const requester = accounts[9]
  const dist = await XYDistribution.deployed()
  const fee = await vorCoord.methods.getProviderGranularFee(KEY_HASH, dist.address).call()
  const fromBlock = 0

  console.log("consumerOwner", consumerOwner)
  console.log("provider", provider)
  console.log("keyHash", KEY_HASH)
  console.log("XYDistribution", dist.address)
  console.log("fee", fee.toString())
  await dist.registerMoniker("Sky", { from: requester })
  await dist.increaseVorAllowance(
    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
    { from: consumerOwner },
  )
  await xfund.methods.transfer(requester, fee).send({ from: consumerOwner })
  await xfund.methods.increaseAllowance(dist.address, fee).send({ from: requester })
  const seed = Date.now()
  try {
    await dist.startDistribute("ipfs#hash", 1000, 500, 1, seed, KEY_HASH, fee, { from: requester })
  } catch (e) {
    console.log(e)
  }

  console.log("wait....")

  await sleep(8000)

  const evs = await dist.getPastEvents("DistributeResult", { fromBlock, toBlock: "latest" })

  for (let i = 0; i < evs.length; i += 1) {
    console.log(
      "DistributeResult Event - Distribution #",
      evs[i].returnValues.requestID,
      evs[i].returnValues.distID,
      evs[i].returnValues.sender,
      evs[i].returnValues.beginIndex,
      evs[i].returnValues.sourceCount,
      evs[i].returnValues.destCount,
      evs[i].returnValues.dataType,
    )
  }
  callback()
}
