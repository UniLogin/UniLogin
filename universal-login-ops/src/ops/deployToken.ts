import {Wallet} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import {mockContracts} from '@universal-login/contracts/testutils';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployToken(wallet: Wallet, overrides: CommandOverrides) {
  console.log('Deploying token contract...');
  const contractAddress = await deployContractAndWait(wallet, mockContracts.Token);
  console.log(`Token address: ${contractAddress}`);
}
