import fs from 'fs';
import {providers, Wallet} from 'ethers';
import {defaultAccounts} from 'ethereum-waffle';
import ENSBuilder from 'ens-builder';


class ENSDeployer {
  constructor(provider, deployerPrivateKey) {
    this.provider = provider;
    this.deployerPrivateKey = deployerPrivateKey;
    this.deployer = new Wallet(deployerPrivateKey, provider);
    this.variables = {};
    this.count = 1;
  }

  /* eslint-disable no-console */ 
  save(filename) {
    const content = Object.entries(this.variables)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    fs.writeFile(filename, content, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${filename} file updated.`);
    });
  }

  async deployRegistrars(registrars, tld = 'eth') {
    const builder = new ENSBuilder(this.deployer);
    await builder.bootstrap();
    this.variables.ENS_ADDRESS = builder.ens.address;
    await builder.registerTLD(tld);
    await builder.registerReverseRegistrar();
    for (const domain of Object.keys(registrars)) {
      const [label, tld] = domain.split('.');
      await builder.registerDomain(label, tld);
      this.variables[`ENS_REGISTRAR${this.count}_ADDRESS`] = builder.registrars[domain].address;
      this.variables[`ENS_REGISTRAR${this.count}_PRIVATE_KEY`] = this.deployerPrivateKey;
      this.variables[`ENS_RESOLVER${this.count}_ADDRESS`] = builder.resolver.address;
      this.count += 1;
    }
  }

  static async deploy(jsonRpcUrl, registrars, tld = 'eth') {
    const provider = new providers.JsonRpcProvider(jsonRpcUrl);
    const deployerPrivateKey = defaultAccounts[defaultAccounts.length - 1].secretKey;
    const deployer = new ENSDeployer(provider, deployerPrivateKey);
    await deployer.deployRegistrars(registrars, tld);
    deployer.save('.env');
  }
}

export default ENSDeployer;
