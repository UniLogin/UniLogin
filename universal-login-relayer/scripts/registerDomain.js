import {utils, getDefaultProvider, Contract, Wallet, ContractFactory} from 'ethers';
import config from '../lib/config/relayer';
import ENS from 'universal-login-contracts/build/ENS';
import defaultDeployOptions from '../lib/config/defaultDeployOptions';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import FIFSRegistrar from 'universal-login-contracts/build/FIFSRegistrar';
import TestRegistrar from 'universal-login-contracts/build/TestRegistrar';
import fs from 'fs';

const publicResolverAddress = '0x5d20cf83cb385e06d2f2a892f9322cd4933eacdc';
const ensAddress = '0xe7410170f87102df0055eb195163a03b7f2bff4a';

class Registrar {
  constructor() {
    /* eslint-disable new-cap */
    this.provider = getDefaultProvider('rinkeby');
    this.deployer = new Wallet(config.privateKey, this.provider);
    this.ens = new Contract(ensAddress, ENS.interface, this.deployer);
    this.variables = {};
  }

  sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  getDeployTransaction(contractJSON, args = '') {
    const bytecode = `0x${contractJSON.bytecode}`;
    const abi = contractJSON.interface;
    const transaction = {
      ...defaultDeployOptions,
      ...new ContractFactory(abi, bytecode).getDeployTransaction(...args)
    };
    return transaction;
  }

  async sendAndWaitForTransaction(transaction) {
    const tx = await this.deployer.sendTransaction(transaction);
    let receipt = await this.provider.getTransactionReceipt(tx.hash);
    while (!receipt || !receipt.blockNumber) {
      this.sleep(1000);
      receipt = await this.provider.getTransactionReceipt(tx.hash);
    }
    return receipt.contractAddress;
  }
  
  async waitToBeMined(transaction, timeout = 1000) {    
    let receipt = await this.provider.getTransactionReceipt(transaction.hash);
    while (!receipt || !receipt.blockNumber) {
      this.sleep(timeout);
      receipt = await this.provider.getTransactionReceipt(transaction.hash);
    }
    return receipt;
  }

  save(filename, _variables) {
    const variables = Object.entries(_variables)
      .map(([key, value]) => `  ${key}='${value}'`)
      .join('\n');
    fs.writeFile(filename, variables, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log(`${filename} file updated.`);
    });
  }

  async start(label) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.test`);
    this.variables.DOMAIN = `${label}.test`;

    const testRegistrarAddress = await this.ens.owner(utils.namehash('test'));
    this.testRegistrar = new Contract(testRegistrarAddress, TestRegistrar.interface, this.deployer);
    console.log(`testRegistrarAddress: ${await this.ens.owner(utils.namehash('test'))}`);

    await this.waitToBeMined(await this.testRegistrar.register(labelHash, this.deployer.address));
    console.log(`${label}.test owner: ${await this.ens.owner(node)}`);

    this.publicResolver = new Contract(publicResolverAddress, PublicResolver.interface, this.deployer);
    await this.waitToBeMined(await this.ens.setResolver(node, this.publicResolver.address));
    console.log(`${label}.test resolver: ${await this.ens.resolver(node)}`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = publicResolverAddress;

    const registrarDeployTransaction = this.getDeployTransaction(FIFSRegistrar, [this.ens.address, node]);
    const registrarAddress = await this.sendAndWaitForTransaction(registrarDeployTransaction);
    console.log(`registrarAddress: ${registrarAddress}`);
    this.variables.REGISTRAR_ADDRESS = registrarAddress;

    await this.waitToBeMined(await this.ens.setOwner(node, registrarAddress));
    console.log(`${label}.test owner(registrar): ${await this.ens.owner(node)}`);

    this.save(`./${label}.test_info`, this.variables);
  }
}
const registrar = new Registrar();
registrar.start('my-domain');
