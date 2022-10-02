import { Mainnet, Rinkeby, Config } from '@usedapp/core'

const prodConfig: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `${process.env.REACT_APP_INFURA_KEY}`,
  }
}

const devConfig: Config = {
  readOnlyChainId: Rinkeby.chainId,
  readOnlyUrls: {
    [Rinkeby.chainId]: `${process.env.REACT_APP_INFURA_KEY}`,
  }
}

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig
export default config;