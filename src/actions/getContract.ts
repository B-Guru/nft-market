import { ActionProps } from '.'
import NFTT from '@fluuuid/nft-contracts/build/contracts/NFTT.json'
import { Contract } from 'ethers'
import { ActionType } from '../state'

type Props = ActionProps<{
  chainId: number
}>

const getContract = async ({ dispatch, library, chainId }: Props) => {
  if (!library) throw new Error('No Web3 Found')

  const networkid = (id: number) => {
    switch (id) {
      case 1337:
        return 5777
      default:
        return id
    }
  }

  try {
    const deployedNetwork = NFTT.networks[String(networkid(chainId)) as keyof typeof NFTT.networks]

    if (!deployedNetwork) {
      throw new Error('The network you selected is no supported yet.')
    }

    const { address } = deployedNetwork
    const contract = new Contract(address, NFTT.abi, library.getSigner())

    const name = await contract.name()
    const symbol = await contract.symbol()

    dispatch({
      type: ActionType.CONTRACT,
      payload: {
        payload: contract,
        details: {
          address,
          name,
          symbol,
        },
      },
    })

    return contract
  } catch (e) {
    console.log(e)
    throw new Error(e)
  }
}

export default getContract
