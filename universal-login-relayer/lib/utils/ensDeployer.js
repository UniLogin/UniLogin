import fs from 'fs';
import ethers from 'ethers';
import {defaultAccounts} from 'ethereum-waffle';
import {jsonRpcUrl, ensRegistrars} from '../config/relayer';
import ENSBuilder from '../utils/ensBuilder';


class ENSDeployer {
  constructor(provider, deployerPrivateKey) {
    this.provider = provider;
    this.deployerPrivateKey = deployerPrivateKey;
    this.deployer = new ethers.Wallet(deployerPrivateKey, provider);
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

  async deployRegistrars(registrars = ensRegistrars) {
    const builder = new ENSBuilder(this.deployer);
    await builder.bootstrap();
    this.variables.ENS_ADDRESS = builder.ens.address;
    await builder.registerTLD('eth');
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

  static async deploy() {
    const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
    const deployerPrivateKey = defaultAccounts[defaultAccounts.length - 1].secretKey;
    const deployer = new ENSDeployer(provider, deployerPrivateKey);
    await deployer.deployRegistrars();
    deployer.save('.env');
  }
}

export default ENSDeployer;
