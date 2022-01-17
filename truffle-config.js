require("dotenv").config()
const HDWalletProvider = require("@truffle/hdwallet-provider")

module.exports = {
  networks: {
    // ganache-cli
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "696969", // Any network (default: none)
    },
    // truffle develop console
    develop: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "696969",
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.WALLET_KEY, process.env.WALLET_URL),
      network_id: "4",
      gas: 10000000,
      gasPrice: 100000000000,
      skipDryRun: true,
      networkCheckTimeout: 10000,
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  plugins: ["truffle-plugin-verify"],

  api_keys: {
    etherscan: process.env.ETHERSCAN_API,
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
}
