

export interface networkConfigItem {
  name?: string
  ethUsdPriceFeed?: string
  blockConfirmations?: number
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  localhost: {},
  // hardhat: {},
  '5': {
    name: 'goerli',
    ethUsdPriceFeed: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e',
    blockConfirmations: 6
  },
  '137': {
    name: 'polygon',
    ethUsdPriceFeed: '0xF9680D99D6C9589e2a93a78A04A279e509205945',
    blockConfirmations: 6
  },
  '31337': {
    name: 'hardhat',
    blockConfirmations: 1
  }
}

export const developmentChains = ['hardhat', 'localhost']
// export const developmentChains = [31337]

export const DECIMALS = 8
export const INITIAL_ANSWER = 200000000000 // 2000 USD * 1e8

