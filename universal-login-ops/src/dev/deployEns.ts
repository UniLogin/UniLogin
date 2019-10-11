import ENSDeployer from './ensDeployer';
import {Wallet} from 'ethers';

export async function deployENS(wallet: Wallet, registrars: string[]): Promise<string> {
  const deployer = new ENSDeployer(wallet.provider, wallet.privateKey);
  await deployer.deployRegistrars(registrars);
  const {variables} = deployer;
  console.log(`         ENS address: ${variables.ENS_ADDRESS}`);
  console.log(`  Registered domains: ${registrars.join(', ')}`);
  return variables.ENS_ADDRESS;
}
