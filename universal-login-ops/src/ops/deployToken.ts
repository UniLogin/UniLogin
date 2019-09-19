import Token from '../contracts/Token.json';
import {Wallet} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployToken(wallet: Wallet, overrides: CommandOverrides) {
  console.log('Deploying token contract...');
  const contractAddress = await deployContractAndWait(wallet, Token);
  console.log(`Token address: ${contractAddress}`);
}
