import {deployContract} from 'ethereum-waffle';
import {Wallet} from 'ethers';
import {ContractJSON} from '@unilogin/commons';

export default async function deployToken(deployWallet: Wallet, tokenJson: ContractJSON): Promise<string> {
  const {address} = await deployContract(deployWallet, tokenJson);
  console.log(`       Token address: ${address}`);
  return address;
}
