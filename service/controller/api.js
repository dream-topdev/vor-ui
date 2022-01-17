const { QueryTypes, Op } = require("sequelize")
const {
  NewServiceAgreement,
  ChangeFee,
  ChangeGranularFee,
  RandomnessRequest,
  RandomnessRequestFulfilled,
} = require("../db/models")

const getOracles = async (req, res) => {
  try {
    const services = await NewServiceAgreement.findAll()
    res.send({
      oracles: services,
    })
  } catch (e) {
    res.status(400).send({
      error: "getting oracle failed",
    })
  }
}

const getOracleRequests = async (req, res) => {
  try {
    const { keyHash } = req.params
    let { page, rows } = req.query
    const { q } = req.query
    let where = {}
    if (keyHash === undefined || keyHash === "0") where = {}
    else
      where = {
        keyHash,
      }
    if (q) {
      where = {
        [Op.or]: {
          sender: {
            [Op.like]: `${q}`,
          },
          requestID: {
            [Op.like]: `${q}`,
          },
          "$RandomnessRequestFulfilled.output$": {
            [Op.like]: `%${q}%`,
          },
        },
      }
    }

    if (page === undefined || page === null) page = 0
    if (rows === undefined || rows === null) rows = 5
    const limit = Math.min(100, rows)
    const offset = page * rows
    const requests = await RandomnessRequest.findAndCountAll({
      where,
      limit,
      offset,
      include: {
        model: RandomnessRequestFulfilled,
      },
    })
    res.send({
      requests,
    })
  } catch (e) {
    console.log(e)
    res.status(400).send({
      error: "getting requests failed",
    })
  }
}

const getRequestDetail = async (req, res) => {
  try {
    const { id } = req.params
    const request = await RandomnessRequest.findOne({
      where: {
        requestID: id,
      },
      include: {
        model: RandomnessRequestFulfilled,
      },
    })
    res.send(request)
  } catch (e) {
    res.status(400).send({
      error: "getting requests failed",
    })
  }
}

const getOracleFeeHistory = async (req, res) => {
  try {
    const { keyHash } = req.params
    const fees = await ChangeFee.findAll({
      where: {
        keyHash,
      },
    })
    const granularFees = await ChangeGranularFee.findAll({
      where: {
        keyHash,
      },
    })
    res.send({
      fees,
      granularFees,
    })
  } catch (e) {
    res.status(400).send({
      error: "getting fees failed",
    })
  }
}

const getOracleSummary = async (req, res) => {
  try {
    const { keyHash } = req.params

    const service = await NewServiceAgreement.findOne({
      where: {
        keyHash,
      },
    })
    const wallet = service.providerAddress
    const requestCount = await RandomnessRequest.count({
      where: {
        keyHash,
      },
    })
    const fulfilledCount = await RandomnessRequestFulfilled.count({
      include: {
        model: RandomnessRequest,
        where: {
          keyHash,
        },
      },
    })
    const xFundEarned = await RandomnessRequest.sum("fee", {
      where: {
        keyHash,
      },
    })
    const gasTotal = await RandomnessRequestFulfilled.sequelize.query(
      `SELECT sum(COALESCE("RandomnessRequestFulfilled"."gasUsed", 0) * COALESCE("RandomnessRequestFulfilled"."gasPrice", 0)) AS "gas" 
      FROM "RandomnessRequestFulfilleds" AS "RandomnessRequestFulfilled" 
      INNER JOIN "RandomnessRequests" AS "RandomnessRequest" ON
       "RandomnessRequestFulfilled"."requestID" = "RandomnessRequest"."requestID" AND
        "RandomnessRequest"."keyHash" = '${keyHash}';`,
      { type: QueryTypes.SELECT },
    )
    const gasPaid = gasTotal[0].gas
    console.log(new Date(), "fee and gas", xFundEarned, gasPaid)
    res.send({
      wallet,
      requestCount,
      fulfilledCount,
      xFundEarned,
      gasPaid,
    })
  } catch (e) {
    console.log(e)
    res.status(400).send({
      error: "getting oracle summary failed",
    })
  }
}

module.exports = {
  getOracles,
  getOracleRequests,
  getRequestDetail,
  getOracleFeeHistory,
  getOracleSummary,
}
