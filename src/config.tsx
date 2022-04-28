import { Mainnet, Config } from '@usedapp/core'
import { getDefaultProvider } from 'ethers';

const config: Config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: getDefaultProvider('mainnet'),
  },
}

export default config;