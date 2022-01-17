import Notify from "bnc-notify"
import Onboard from "bnc-onboard"

import { BLOCKNATIVE_API_KEY, NETWORK_ID } from "./Constants"

const networkId = NETWORK_ID
const dappId = BLOCKNATIVE_API_KEY

export function initOnboard(subscriptions) {
  const onboard = Onboard
  return onboard({
    dappId,
    hideBranding: false,
    networkId,
    darkMode: true,
    subscriptions,
    walletSelect: {
      wallets: [{ walletName: "metamask" }],
    },
    walletCheck: [
      { checkName: "derivationPath" },
      { checkName: "connect" },
      { checkName: "accounts" },
      { checkName: "network" },
      { checkName: "balance", minimumBalance: "100000" },
    ],
  })
}

export function initNotify() {
  const notify = Notify
  return notify({
    dappId,
    networkId,
    onerror: (error) => console.log(`Notify error: ${error.message}`),
  })
}
