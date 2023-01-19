import { Mainnet, Goerli, Config } from '@usedapp/core'

const prodConfig: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: `${process.env.REACT_APP_INFURA_KEY}`,
  }
}

const devConfig: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: `${process.env.REACT_APP_INFURA_KEY}`,
  }
}

export default process.env.REACT_APP_ENV === "dev" ? devConfig : prodConfig;