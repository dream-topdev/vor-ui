const xYDistributionABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_vorCoordinator",
        type: "address",
      },
      {
        internalType: "address",
        name: "_xfund",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "distID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestID",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "beginIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sourceCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "destCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum XYDistribution.DataType",
        name: "dataType",
        type: "uint8",
      },
    ],
    name: "DistributeResult",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "requester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "moniker",
        type: "string",
      },
    ],
    name: "NewMoniker",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "distID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "requestID",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfs",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sourceCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "destCount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum XYDistribution.DataType",
        name: "dataType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "StartingDistribute",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "distributions",
    outputs: [
      {
        internalType: "string",
        name: "ipfs",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "sourceCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "destCount",
        type: "uint256",
      },
      {
        internalType: "enum XYDistribution.DataType",
        name: "dataType",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "keyHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "seed",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "monikers",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "nextDistributionId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "randomness",
        type: "uint256",
      },
    ],
    name: "rawFulfillRandomness",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "requestIdToAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "requestIdToDistributionId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfs",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_sourceCount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_destCount",
        type: "uint256",
      },
      {
        internalType: "enum XYDistribution.DataType",
        name: "_dataType",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_seed",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_keyHash",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "startDistribute",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_moniker",
        type: "string",
      },
    ],
    name: "registerMoniker",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMoniker",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "increaseVorAllowance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_vorCoordinator",
        type: "address",
      },
    ],
    name: "setVORCoordinator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getVORCoordinator",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
]
module.exports = {
  xYDistributionABI,
}
