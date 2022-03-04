import { Mainnet, Config } from '@usedapp/core'

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `${process.env.REACT_APP_INFRUA_KEY}`,
  },
}

export default config;