import {utils, Contract} from 'ethers';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import FIFSRegistrar from 'universal-login-contracts/build/FIFSRegistrar';
import TestRegistrar from 'universal-login-contracts/build/TestRegistrar';
import ENSRegistrarBase from './ENSRegistrarBase';
import {waitToBeMined} from 'universal-login-contracts';
import {sendAndWaitForTransaction, getDeployTransaction, saveVariables} from '../utils';

class DomainRegistrar extends ENSRegistrarBase {
  async registerInRegistrar(label, labelHash, node, tld) {
    const tldRegistrarAddress = await this.ens.owner(utils.namehash(tld));
    this.testRegistrar = new Contract(tldRegistrarAddress, TestRegistrar.interface, this.deployer);
    this.log(`Registrar address for ${tld}: ${tldRegistrarAddress}`);
    const transaction = await this.testRegistrar.register(labelHash, this.deployer.address, {gasLimit: 100000});
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Registered ${label}.${tld} with owner: ${await this.ens.owner(node)}`);
  }

  async setAsResolverPublicResolver(label, node, tld) {
    this.publicResolver = new Contract(this.config.chainSpec.publicResolverAddress, PublicResolver.interface, this.deployer);
    const transaction = await this.ens.setResolver(node, this.publicResolver.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Resolver for ${label}.${tld} set to ${await this.ens.resolver(node)} (public resolver)`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.config.chainSpec.publicResolverAddress;
  }

  async deployNewRegistrar(node) {
    const registrarDeployTransaction = getDeployTransaction(FIFSRegistrar, [this.ens.address, node]);
    this.registrarAddress = await sendAndWaitForTransaction(this.deployer, registrarDeployTransaction);
    this.log(`New registrar deployed: ${this.registrarAddress}`);
    this.variables.REGISTRAR_ADDRESS = this.registrarAddress;
    return this.registrarAddress;
  }

  async setRegistrarAsOwner(label, node, tld) {
    const transaction = await this.ens.setOwner(node, this.registrarAddress);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`${label}.${tld} owner set to: ${await this.ens.owner(node)} (registrar)`);
  }

  async start(label, tld) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${tld}`);
    this.variables.DOMAIN = `${label}.${tld}`;
    this.log(`Registering ${label}.${tld}...`);

    await this.registerInRegistrar(label, labelHash, node, tld);
    await this.setAsResolverPublicResolver(label, node, tld);
    await this.deployNewRegistrar(node);
    await this.setRegistrarAsOwner(label, node, tld);
  }

  async registerAndSave(label, tld) {
    await this.start(label, tld);
    const filename = `./${label}.${tld}_info`;
    saveVariables(filename, this.variables);
    this.log(`${filename} file updated.`);
  }
}

export default DomainRegistrar;
