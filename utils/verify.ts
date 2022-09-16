import { run } from 'hardhat'

export const verify = async (contractAddress: string, args: any[]) => {
  console.log('Verifying contract...')
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args
    })
  } catch (error: any) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Already verified')
    }
    console.error(error)
  }
}