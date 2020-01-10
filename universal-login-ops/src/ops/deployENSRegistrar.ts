import {Wallet, Contract} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';
import {gnosisSafe} from '@universal-login/contracts';
import {CommandOverrides} from '../cli/connectAndExecute';

export default async function deployENSRegistrar(wallet: Wallet, overrides?: CommandOverrides) {
  console.log('Deploying ENSRegistrar contract...');
  const contractAddress = await deployContractAndWait(wallet, gnosisSafe.ENSRegistrar, [], overrides as any);
  console.log(`ENSRegistrar address: ${contractAddress}`);
  return new Contract(contractAddress, gnosisSafe.ENSRegistrar.interface, wallet.provider);
}
