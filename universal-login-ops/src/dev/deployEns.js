import ENSDeployer from './ensDeployer';

export async function deployENS(wallet, registrars) {
  const deployer = new ENSDeployer(wallet.provider, wallet.privateKey);
  await deployer.deployRegistrars(registrars);
  const {variables} = deployer;
  console.log(`         ENS address: ${variables.ENS_ADDRESS}`);
  console.log(`  Registered domains: ${registrars.join(', ')}`)
  return variables.ENS_ADDRESS;
}
