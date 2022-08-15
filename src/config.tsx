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

export const uniswapConfig = {
  jsonRpcUrlMap: {
    1: [`${process.env.REACT_APP_INFURA_KEY}`]
  },
  tokenList: [
    {
      "name": "Ribbit",
      "address": "0x46898f15F99b8887D87669ab19d633F579939ad9",
      "symbol": "RIBBIT",
      "decimals": 18,
      "chainId": 1,
      "logoURI": "https://etherscan.io/token/images/froggyfriends_32.png"
    }
  ],
  outputTokenAddress: "0x46898f15F99b8887D87669ab19d633F579939ad9",
  outputAmount: 10000
}

const config = process.env.NODE_ENV === "production" ? prodConfig : devConfig
export default config;