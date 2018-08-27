import {utils} from 'ethers';
import {addressToBytes32} from './utils';
import {deployContract} from 'ethereum-waffle';
import ENSRegistry from '../../build/ENSRegistry';
import PublicResolver from '../../build/PublicResolver';
import TestRegistrar from '../../build/TestRegistrar';

const {namehash} = utils;

class ENSBuilder {
  constructor(deployer) {
    this.deployer = deployer;
    this.registrars = [];
  }

  async bootstrapENS() {
    const emptyNode = addressToBytes32('0x0');
    this.ens = await deployContract(this.deployer, ENSRegistry, []);
    this.adminRegistrar = await deployContract(this.deployer, TestRegistrar, [this.ens.address, emptyNode]);
    await this.ens.setOwner([0], this.adminRegistrar.address);
  }

  async registerTLD(tld) {
    const label = utils.keccak256(utils.toUtf8Bytes(tld));
    const ethNode = namehash(tld);
    await this.adminRegistrar.register(label, this.deployer.address);
    this.resolver = await deployContract(this.deployer, PublicResolver, [this.ens.address]);
    await this.ens.setResolver(ethNode, this.resolver.address);
    this.registrars[tld] = await deployContract(this.deployer, TestRegistrar, [this.ens.address, ethNode]);
    await this.ens.setOwner(ethNode, this.registrars[tld].address);
  }

  async registerDomain(label, domain) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const newDomain = `${label}.${domain}`;
    const node = namehash(newDomain);
    await this.registrars[domain].register(labelHash, this.deployer.address);
    await this.ens.setResolver(node, this.resolver.address);
    this.registrars[newDomain] = await deployContract(this.deployer, TestRegistrar, [this.ens.address, node]);
    await this.ens.setOwner(node, this.registrars[newDomain].address);
    return this.registrars[newDomain];
  }

  async registerAddress(label, domain, address) {
    const node = namehash(`${label}.${domain}`);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    await this.registrars[domain].register(hashLabel, this.deployer.address);
    await this.ens.setResolver(node, this.resolver.address);
    await this.resolver.setAddr(node, address);
  }
}

export default ENSBuilder;
