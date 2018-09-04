const config = require('../config/config');
import {getWallets, defaultAccounts, deployContract} from 'ethereum-waffle';
import ethers from 'ethers';
import fs from 'fs';
import Clicker from '../build/Clicker';

const {jsonRpcUrl} = config;

/* eslint-disable no-console */
class ContractsDelpoyer {

  save(filename, _variables) {
    const variables = Object.entries(_variables)
      .map(([key, value]) => `  ${key}: '${value}'`)
      .join(',\n');

    const content = `module.exports = Object.freeze({\n${variables}\n});`; 

    fs.writeFile(filename, content, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${filename} file updated.`);
    });
  }

  async main() {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.wallets = await getWallets(this.provider);
    this.deployer = this.wallets[this.wallets.length - 1];
    this.deployerPrivateKey = defaultAccounts[defaultAccounts.length - 1].secretKey;
    const contract = await deployContract(this.deployer, Clicker);
    const variables = {};
    variables.clickerContractAddress = contract.address;
    this.save('./config/addresses.js', variables);
  }
}

const prepare = new ContractsDelpoyer();
prepare.main();