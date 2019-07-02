import Token from '../contracts/Token.json';
import {Wallet} from 'ethers';
import {deployContract} from '@universal-login/commons';


export default async function deployToken(wallet: Wallet) {
  console.log('Deploying token contract...');
  const contract = await deployContract(wallet, Token);
  console.log(`Token address: ${contract.address}`);
}
