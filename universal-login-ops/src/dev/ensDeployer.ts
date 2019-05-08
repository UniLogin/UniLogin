import fs from 'fs';
import {providers, Wallet} from 'ethers';
import {defaultAccounts} from 'ethereum-waffle';
const ENSBuilder = require('ens-builder'); // TO DO: change to import (ens-builder doesn't have types now
import {parseDomain} from '@universal-login/commons';

class ENSDeployer {
  private readonly deployer : Wallet;
  private variables : Record<string, string>;
  constructor(provider : providers.Provider, deployerPrivateKey : string) {
    this.deployer = new Wallet(deployerPrivateKey, provider);
    this.variables = {};
  }

  save(filename : string) {
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

  async deployRegistrars(registrars : string[], tld = 'eth') {
    const builder = new ENSBuilder(this.deployer);
    await builder.bootstrap();
    this.variables.ENS_ADDRESS = builder.ens.address;
    await builder.registerTLD(tld);
    await builder.registerReverseRegistrar();
    for (let count = 0; count < registrars.length; count++) {
      const domain = registrars[count];
      const [label, tld] = parseDomain(domain);
      await builder.registerDomain(label, tld);
    }
  }

  static async deploy(jsonRpcUrl : string, registrars : string[], tld = 'eth') {
    const provider = new providers.JsonRpcProvider(jsonRpcUrl);
    const deployerPrivateKey = defaultAccounts[defaultAccounts.length - 1].secretKey;
    const deployer = new ENSDeployer(provider, deployerPrivateKey);
    await deployer.deployRegistrars(registrars, tld);
    deployer.save('.env');
  }
}

export default ENSDeployer;
