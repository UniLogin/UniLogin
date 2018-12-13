import {utils, Contract} from 'ethers';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';
import ReverseRegistrar from 'universal-login-contracts/build/ReverseRegistrar';
import FIFSRegistrar from 'universal-login-contracts/build/FIFSRegistrar';
import ENSRegistrarBase from './ENSRegistrarBase';
import {waitToBeMined} from '../utils';

class ENSNameRegistrar extends ENSRegistrarBase {
  async registerName(labelHash, domain) {
    this.registrar = new Contract(this.registrarAddress, FIFSRegistrar.interface, this.deployer);
    await waitToBeMined(this.provider, await this.registrar.register(labelHash, this.deployer.address, {gasLimit: 100000}));
    const resolverAddress = await this.ens.resolver(utils.namehash(domain));
    console.log(`resolverAddress: ${resolverAddress}`);
  }

  async setResolver(node, label, domain) {
    this.publicResolver = new Contract(this.resolverAddress, PublicResolver.interface, this.deployer);
    await waitToBeMined(this.provider, await this.ens.setResolver(node, this.publicResolver.address));
    console.log(`${label}.${domain} resolver: ${await this.ens.resolver(node)}`);
    console.log(`${label}.${domain} owner: ${await this.ens.owner(node)}`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.resolverAddress;
  }

  async setAddress(node, label, domain) {
    await waitToBeMined(this.provider, await this.publicResolver.setAddr(node, this.deployer.address));
    console.log(`${label}.${domain} this ENS name addr: ${await this.publicResolver.addr(node)}`);
  }

  async setReverseName(label, domain) {
    const reverseRegistrarAddress = await this.ens.owner(utils.namehash('addr.reverse'));
    this.reverseRegistrar = new Contract(reverseRegistrarAddress, ReverseRegistrar.interface, this.deployer);
    await waitToBeMined(this.provider, await this.reverseRegistrar.setName(`${label}.${domain}`, {gasLimit: 500000}));
  }

  async getReverseResolver(reverseNode) {
    const reverseAddress = await this.ens.resolver(reverseNode);
    console.log(`reverseAddress: ${reverseAddress}`);
    this.reverseResolver = new Contract(reverseAddress, PublicResolver.interface, this.deployer);
    console.log(`${this.deployer.address} ENS name: ${await this.reverseResolver.name(reverseNode)}`);
  }

  async start(label, domain) {
    await this.prepareNameRegistration(domain);
    
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${domain}`);
    const reverseNode = utils.namehash(`${this.deployer.address.slice(2)}.addr.reverse`.toLowerCase());
    this.variables.ENS_NAME = `${label}.${domain}`;
    console.log(`${this.variables.ENS_NAME} registration`);

    await this.registerName(labelHash, domain);
    await this.setResolver(node, label, domain);
    await this.setAddress(node, label, domain);
    await this.setReverseName(label, domain);
    await this.getReverseResolver(reverseNode); 
  }
}

export default ENSNameRegistrar;


