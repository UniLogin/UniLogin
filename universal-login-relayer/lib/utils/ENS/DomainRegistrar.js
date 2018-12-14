import {utils, Contract} from 'ethers';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import FIFSRegistrar from 'universal-login-contracts/build/FIFSRegistrar';
import TestRegistrar from 'universal-login-contracts/build/TestRegistrar';
import ENSRegistrarBase from './ENSRegistrarBase';
import {sendAndWaitForTransaction, getDeployTransaction, waitToBeMined, save} from '../utils';

class DomainRegistrar extends ENSRegistrarBase {
  async registerInRegistrar(label, labelHash, node, tld) {
    const testRegistrarAddress = await this.ens.owner(utils.namehash(tld));
    this.testRegistrar = new Contract(testRegistrarAddress, TestRegistrar.interface, this.deployer);
    console.log(`testRegistrarAddress: ${testRegistrarAddress}`);
    await waitToBeMined(this.provider, await this.testRegistrar.register(labelHash, this.deployer.address, {gasLimit: 100000}));
    console.log(`${label}.${tld} owner: ${await this.ens.owner(node)}`);
  }

  async setAsResolverPublicResolver(label, node, tld) {
    this.publicResolver = new Contract(this.config.chainSpec.publicResolverAddress, PublicResolver.interface, this.deployer);
    await waitToBeMined(this.provider, await this.ens.setResolver(node, this.publicResolver.address));
    console.log(`${label}.${tld} resolver: ${await this.ens.resolver(node)}`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.config.chainSpec.publicResolverAddress;
  }

  async deployNewRegistrar(node) {
    const registrarDeployTransaction = getDeployTransaction(FIFSRegistrar, [this.ens.address, node]);  
    this.registrarAddress = await sendAndWaitForTransaction(this.deployer, registrarDeployTransaction);
    console.log(`registrarAddress: ${this.registrarAddress}`);
    this.variables.REGISTRAR_ADDRESS = this.registrarAddress;
    return this.registrarAddress;
  }

  async setRegistrarAsOwner(label, node, tld) {
    await waitToBeMined(this.provider, await this.ens.setOwner(node, this.registrarAddress));
    console.log(`${label}.${tld} owner(registrar): ${await this.ens.owner(node)}`);
  }

  async start(label, tld) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${tld}`);
    this.variables.DOMAIN = `${label}.${tld}`;
    console.log(`${label}.${tld} registration`);
    
    await this.registerInRegistrar(label, labelHash, node, tld);
    await this.setAsResolverPublicResolver(label, node, tld);
    await this.deployNewRegistrar(node);
    await this.setRegistrarAsOwner(label, node, tld);

    save(`./${label}.${tld}_info`, this.variables);
  }
}

export default DomainRegistrar;
