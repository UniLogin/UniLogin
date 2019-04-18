import {utils, Contract} from 'ethers';
import FIFSRegistrar from '@universal-login/contracts/build/FIFSRegistrar.json';
import PublicResolver from '@universal-login/contracts/build/PublicResolver.json';
import ReverseRegistrar from '@universal-login/contracts/build/ReverseRegistrar.json';
import {waitToBeMined} from '@universal-login/commons';
import ENSRegistrarBase from './ENSRegistrarBase';

class ENSNameRegistrar extends ENSRegistrarBase {
  private registrar?: Contract;
  private reverseRegistrar? : Contract;
  private publicResolver? : Contract;
  private reverseResolver? : Contract;

  async registerName(labelHash : string, label : string, domain : string, node : string) {
    this.registrar = new Contract(this.registrarAddress, FIFSRegistrar.interface, this.deployer);
    const transaction = await this.registrar.register(labelHash, this.deployer.address, {gasLimit: 100000});
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Registered ${label}.${domain} with owner: ${await this.ens.owner(node)}`);
  }

  async setResolver(node : string, label : string, domain : string) {

    this.publicResolver = new Contract(this.resolverAddress, PublicResolver.interface, this.deployer);
    const transaction = await this.ens.setResolver(node, this.publicResolver.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Resolver for ${label}.${domain} set to: ${await this.ens.resolver(node)}`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.resolverAddress;
  }

  async setAddress(node : string, label : string, domain : string) {
    const transaction = await this.publicResolver!.setAddr(node, this.deployer.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Address for ${label}.${domain} is ${await this.publicResolver!.addr(node)}`);
  }

  async setReverseName(label : string, domain : string) {
    const reverseRegistrarAddress = await this.ens.owner(utils.namehash('addr.reverse'));
    this.reverseRegistrar = new Contract(reverseRegistrarAddress, ReverseRegistrar.interface, this.deployer);
    const transaction = await this.reverseRegistrar.setName(`${label}.${domain}`, {gasLimit: 500000});
    await waitToBeMined(this.provider, transaction.hash);
  }

  async checkReverseName(reverseNode : string, address : string) {
    const reverseAddress = await this.ens.resolver(reverseNode);
    this.log(`Reverse resolver for ${address} is ${reverseAddress}`);
    this.reverseResolver = new Contract(reverseAddress, PublicResolver.interface, this.deployer);
    this.log(`ENS name for ${this.deployer.address} is ${await this.reverseResolver.name(reverseNode)}`);
  }

  async start(label : string, domain : string) {
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


