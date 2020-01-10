import {Wallet, Contract} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import ENSRegistrar from '@universal-login/contracts/dist/contracts/ENSRegistrar.json';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployENSRegistrar(wallet: Wallet, overrides?: CommandOverrides) {
  console.log('Deploying ENSRegistrar contract...');
  const contractAddress = await deployContractAndWait(wallet, ENSRegistrar, [], overrides as any);
  console.log(`ENSRegistrar address: ${contractAddress}`);
  return new Contract(contractAddress, ENSRegistrar.interface, wallet.provider);
}
