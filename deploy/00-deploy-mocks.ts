import { network } from 'hardhat'
import { DeployFunction } from 'hardhat-deploy/dist/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
} from '../helper-hardhat-config'

const deployMocks: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  // const chainId = network.config.chainId
  const chainName = network.name

  // if (developmentChains.includes(chainId!)) {
  if (developmentChains.includes(chainName)) {

    log('Local network detected! Deploying mocks...')

    await deploy('MockV3Aggregator', {
      contract: 'MockV3Aggregator',
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    })

    log('Mocks deployed!')
    log('------------------------------------------')
  }

}

export default deployMocks

deployMocks.tags = ['all', 'mocks']
