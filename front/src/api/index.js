import { IPFS_URL, SERVICE_API_URL } from "../utils/Constants"

require("dotenv").config()

export const getOracles = async () => {
  console.log(new Date(), "get oracles")
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/api/oracle`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const getOracleSummary = async (keyHash) => {
  console.log(new Date(), "get oracle summary")
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/api/oracle/summary/${keyHash}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const getRequests = async (keyHash, page, rows, query) => {
  console.log(new Date(), "get oracle detail")
  return new Promise((resolve, reject) => {
    let url = `${SERVICE_API_URL}/api/oracle/requests/${keyHash}?page=${page}&rows=${rows}`
    if (query !== undefined) {
      url = `${url}&q=${query}`
    }
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const getRequestDetail = async (id) => {
  console.log(new Date(), "get oracle detail", id)
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/api/oracle/request/${id}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const getOracleFeeHistory = async (keyHash, page, rows) => {
  console.log(new Date(), "get oracle fee history")
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/api/oracle/fees/${keyHash}?page=${page}&rows=${rows}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const addDatatoIPFS = async (moniker, address, data) => {
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/portal/upload`
    console.log(new Date(), "url", url)
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        moniker,
        address,
        data,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        resolve(d)
      })
      .catch((err) => {
        console.error(err.toString())
        reject(err)
      })
  })
}
export const getDataFromIPFS = async (ipfs) => {
  return new Promise((resolve, reject) => {
    const url = `${IPFS_URL}/${ipfs}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.error(err.toString())
        reject(err)
      })
  })
}

export const getDistRequests = async (keyHash, page, rows, query) => {
  console.log(new Date(), "get XYDistribution requests")
  return new Promise((resolve, reject) => {
    let url = `${SERVICE_API_URL}/portal/requests/${keyHash}?page=${page}&rows=${rows}`
    if (query !== undefined) {
      url = `${url}&q=${query}`
    }
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}
export const getDistRequesters = async () => {
  console.log(new Date(), "get XYDistribution requests")
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/portal/requesters`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}
export const getDistRequester = async (address) => {
  console.log(new Date(), "get XYDistribution requester")
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/portal/requester/${address}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}

export const getDistDetail = async (id) => {
  console.log(new Date(), "get distribution detail", id)
  return new Promise((resolve, reject) => {
    const url = `${SERVICE_API_URL}/portal/request/${id}`
    console.log(new Date(), "url", url)
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        resolve(data)
      })
      .catch((err) => {
        console.log(err.toString())
        reject(err)
      })
  })
}
