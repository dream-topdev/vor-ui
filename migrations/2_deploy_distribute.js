require("dotenv").config()

const XYDistribution = artifacts.require("XYDistribution")

const { REACT_APP_VORCOORDINATOR_ADDRESS, REACT_APP_XFUND_ADDRESS } = process.env

module.exports = function (deployer, network) {
  switch (network) {
    default:
    case "development":
    case "develop":
      deployer
        .deploy(XYDistribution, REACT_APP_VORCOORDINATOR_ADDRESS, REACT_APP_XFUND_ADDRESS)
        .then(async function () {
          // increase VOR allowance
          try {
            const dist = await XYDistribution.deployed()
            await dist.increaseVorAllowance(
              "115792089237316195423570985008687907853269984665640564039457584007913129639935",
            )
          } catch (e) {
            console.log(e)
          }
        })
      break
    case "rinkeby":
    case "rinkeby-fork":
      deployer
        .deploy(
          XYDistribution,
          "0x6d5Ba663dDCa573557c8420256Dc85F31D9762B0",
          "0x245330351344F9301690D5D8De2A07f5F32e1149",
        )
        .then(async function () {
          // increase VOR allowance
          try {
            const dist = await XYDistribution.deployed()
            await dist.increaseVorAllowance(
              "115792089237316195423570985008687907853269984665640564039457584007913129639935",
            )
          } catch (e) {
            console.log(e)
          }
        })
      break
  }
}
