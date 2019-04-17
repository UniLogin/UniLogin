import {utils, Contract} from 'ethers';
import PublicResolver from '@universal-login/contracts/build/PublicResolver.json';
import FIFSRegistrar from '@universal-login/contracts/build/FIFSRegistrar.json';
import TestRegistrar from '@universal-login/contracts/build/TestRegistrar.json';
import {waitToBeMined, sendAndWaitForTransaction, saveVariables, getDeployTransaction} from '@universal-login/commons';
import ENSRegistrarBase from './ENSRegistrarBase';

class DomainRegistrar extends ENSRegistrarBase {
  private testRegistrar? : Contract;
  private publicResolver? : Contract;

  async registerInRegistrar(label : string, labelHash : string, node : string, tld : string) {
    const tldRegistrarAddress = await this.ens.owner(utils.namehash(tld));
    this.testRegistrar = new Contract(tldRegistrarAddress, TestRegistrar.interface, this.deployer);
    this.log(`Registrar address for ${tld}: ${tldRegistrarAddress}`);
    const transaction = await this.testRegistrar.register(labelHash, this.deployer.address, {gasLimit: 100000});
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Registered ${label}.${tld} with owner: ${await this.ens.owner(node)}`);
  }

  async setAsResolverPublicResolver(label : string, node : string, tld : string) {
    this.publicResolver = new Contract(this.config.chainSpec.publicResolverAddress!, PublicResolver.interface, this.deployer);
    const transaction = await this.ens.setResolver(node, this.publicResolver.address);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Resolver for ${label}.${tld} set to ${await this.ens.resolver(node)} (public resolver)`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.config.chainSpec.publicResolverAddress!;
  }

  async deployNewRegistrar(node : string) {
    const registrarDeployTransaction = getDeployTransaction(FIFSRegistrar, [this.ens.address, node]);
    this.registrarAddress = await sendAndWaitForTransaction(this.deployer, registrarDeployTransaction);
    this.log(`New registrar deployed: ${this.registrarAddress}`);
    this.variables.REGISTRAR_ADDRESS = this.registrarAddress;
    return this.registrarAddress;
  }

  async setRegistrarAsOwner(label : string, node : string, tld : string) {
    const transaction = await this.ens.setOwner(node, this.registrarAddress);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`${label}.${tld} owner set to: ${await this.ens.owner(node)} (registrar)`);
  }

  async start(label : string, tld : string) {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${tld}`);
    this.variables.DOMAIN = `${label}.${tld}`;
    this.log(`Registering ${label}.${tld}...`);

    await this.registerInRegistrar(label, labelHash, node, tld);
    await this.setAsResolverPublicResolver(label, node, tld);
    await this.deployNewRegistrar(node);
    await this.setRegistrarAsOwner(label, node, tld);
  }

  async registerAndSave(label : string, tld : string) {
    await this.start(label, tld);
    const filename = `./${label}.${tld}_info`;
    saveVariables(filename, this.variables);
    this.log(`${filename} file updated.`);
  }
}

export default DomainRegistrar;
