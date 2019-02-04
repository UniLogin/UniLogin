const {ENSDeployer} = require('universal-login-relayer');

async function deployENS(wallet, registrars) {
  const deployer = new ENSDeployer(wallet.provider, wallet.privateKey);
  await deployer.deployRegistrars(registrars);
  const {variables} = deployer;
  console.log(`Ens deployed to address: ${variables.ENS_ADDRESS}`);
  return variables.ENS_ADDRESS;
}

module.exports = deployENS;
