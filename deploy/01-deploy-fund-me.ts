import { network } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { developmentChains, networkConfig } from '../helper-hardhat-config'
import { verify } from '../utils/verify'
import 'dotenv/config'

const deployFundMe: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log, get } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId!

  let ethUsdPriceFeedAddress
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await get('MockV3Aggregator')
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]['ethUsdPriceFeed']
  }


  // if the contract doesn't exists, we deploy a minimal version
  // for out local testing

  // when going for localhost or hardhat network we want to use mocks

  const args = [ethUsdPriceFeedAddress]

  try {
    const fundMe = await deploy('FundMe', {
      from: deployer,
      args, // put price feed address
      log: true,
      waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
      await verify(fundMe.address, args) 
    }
    
  } catch (error) {

    console.error('Deploy Error', error)
    
  }

  log('----------------------------------------------------------------')
}

export default deployFundMe

deployFundMe.tags = ['all', 'fundme']
