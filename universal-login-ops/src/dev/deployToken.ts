import Token from '../contracts/MockDai.json';
import {deployContract} from 'ethereum-waffle';
import {Wallet} from 'ethers';

export default async function deployToken(deployWallet: Wallet): Promise<string> {
  const {address} = await deployContract(deployWallet, Token);
  console.log(`       Token address: ${address}`);
  return address;
}
