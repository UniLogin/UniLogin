import {utils, Contract} from 'ethers';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import ReverseRegistrar from 'universal-login-contracts/build/ReverseRegistrar';
import FIFSRegistrar from 'universal-login-contracts/build/FIFSRegistrar';
import ENSRegistrarBase from './ENSRegistrarBase';
import {waitToBeMined} from 'universal-login-commons';

class ENSNameRegistrar extends ENSRegistrarBase {
  async registerName(labelHash, label, domain, node) {
    this.registrar = new Contract(this.registrarAddress, FIFSRegistrar.interface, this.deployer);
    const transaction = await this.registrar.register(labelHash, this.deployer.address, {gasLimit: 100000});
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Registered ${label}.${domain} with owner: ${await this.ens.owner(node)}`);
  }

  async setResolver(node, label, domain) {
    this.publicResolver = new Contract(this.resolverAddress, PublicResolver.interface, this.deployer);
    const transaction = await this.ens.setResolver(node, this.publicResolver.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Resolver for ${label}.${domain} set to: ${await this.ens.resolver(node)}`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.resolverAddress;
  }

  async setAddress(node, label, domain) {
    const transaction = await this.publicResolver.setAddr(node, this.deployer.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Address for ${label}.${domain} is ${await this.publicResolver.addr(node)}`);
  }

  async setReverseName(label, domain) {
    const reverseRegistrarAddress = await this.ens.owner(utils.namehash('addr.reverse'));
    this.reverseRegistrar = new Contract(reverseRegistrarAddress, ReverseRegistrar.interface, this.deployer);
    const transaction = await this.reverseRegistrar.setName(`${label}.${domain}`, {gasLimit: 500000});
    await waitToBeMined(this.provider, transaction.hash);
  }

  async checkReverseName(reverseNode, address) {
    const reverseAddress = await this.ens.resolver(reverseNode);
    this.log(`Reverse resolver for ${address} is ${reverseAddress}`);
    this.reverseResolver = new Contract(reverseAddress, PublicResolver.interface, this.deployer);
    this.log(`ENS name for ${this.deployer.address} is ${await this.reverseResolver.name(reverseNode)}`);
  }

  async start(label, domain) {
    await this.prepareNameRegistration(domain);

    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${domain}`);
    const reverseNode = utils.namehash(`${this.deployer.address.slice(2)}.addr.reverse`.toLowerCase());
    this.variables.ENS_NAME = `${label}.${domain}`;
    this.log(`Registgering ${this.variables.ENS_NAME}...`);
    await this.registerName(labelHash, label, domain, node);
    await this.setResolver(node, label, domain);
    await this.setAddress(node, label, domain);
    await this.setReverseName(label, domain);
    await this.checkReverseName(reverseNode, this.deployer.address);
  }
}

export default ENSNameRegistrar;


