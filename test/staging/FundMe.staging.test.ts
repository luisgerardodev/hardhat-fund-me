import { assert } from 'chai'
import { ethers, getNamedAccounts, network } from 'hardhat'
import { developmentChains } from '../../helper-hardhat-config'
import { FundMe } from '../../typechain-types'

developmentChains.includes(network.name)
  ? describe.skip
  : describe('FundMe', async function () {
      let fundMe: FundMe, deployer: string
      const sendValue = ethers.utils.parseEther('0.5')



      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        fundMe = await ethers.getContract('FundMe', deployer)
      })

      it('Should allow people to fund and withdraw', async function () {
        await fundMe.fund({ value: sendValue, gasLimit: 100000 })
        await fundMe.withdraw()

        const endingBalance = await fundMe.provider.getBalance(fundMe.address)

        assert.equal(endingBalance.toString(), '0')

      })

    })
