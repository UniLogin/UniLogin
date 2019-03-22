import Token from '../contracts/Token.json';
import {deployContract} from 'ethereum-waffle';

export async function deployToken(deployWallet) {
  const {address} = await deployContract(deployWallet, Token);
  console.log(`       Token address: ${address}`);
  return address;
}
