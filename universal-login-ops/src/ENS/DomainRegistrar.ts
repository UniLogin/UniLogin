import {utils, Contract} from 'ethers';
import PublicResolver from '@universal-login/contracts/build/PublicResolver.json';
import FIFSRegistrar from '@universal-login/contracts/build/FIFSRegistrar.json';
import TestRegistrar from '@universal-login/contracts/build/TestRegistrar.json';
import {waitToBeMined, sendAndWaitForTransaction, getDeployTransaction, ensure} from '@universal-login/commons';
import {saveVariables} from '../utils/save';
import ENSRegistrarBase from './ENSRegistrarBase';

class DomainRegistrar extends ENSRegistrarBase {
  private testRegistrar? : Contract;

  async registerInRegistrar(label : string, labelHash : string, node : string, tld : string) {
    const tldRegistrarAddress = await this.ens.owner(utils.namehash(tld));
    this.testRegistrar = new Contract(tldRegistrarAddress, TestRegistrar.interface, this.deployer);
    this.log(`Registrar address for ${tld}: ${tldRegistrarAddress}`);
    const transaction = await this.testRegistrar.register(labelHash, this.deployer.address, {gasLimit: 100000});
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Registered ${label}.${tld} with owner: ${await this.ens.owner(node)}`);
  }

  async setAsResolverPublicResolver(label : string, node : string, tld : string) {
    await this.setResolver(label, node, tld, this.ensInfo.publicResolverAddress!);
  }

  async setResolver(label : string, node : string, tld : string, resolverAddress: string) {
    const transaction = await this.ens.setResolver(node, resolverAddress);
    await waitToBeMined(this.provider, transaction.hash);
    this.log(`Resolver for ${label}.${tld} set to ${await this.ens.resolver(node)} (public resolver)`);
    this.variables.PUBLIC_RESOLVER_ADDRESS = this.ensInfo.publicResolverAddress!;
  }

  async deployNewPublicResolver() {
    const resolverDeployTransaction = getDeployTransaction(PublicResolver, [this.ens.address]);
    const newPublicResolver = await sendAndWaitForTransaction(this.deployer, resolverDeployTransaction);
    this.log(`New public resolver deployed: ${newPublicResolver}`);
    return newPublicResolver;
  }

  async deployAndSetPublicResolver(label : string, node : string, tld : string) {
    const publicResolver = await this.deployNewPublicResolver();
    await this.setResolver(label, node, tld, publicResolver as string);
    return publicResolver;
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

  async registerEthDomain(label : string) {
    const tld = 'eth';
    const node = utils.namehash(`${label}.${tld}`);
    this.log(`Registering ${label}.${tld}...`);

    ensure(await this.ens.owner(node) === this.deployer.address, Error, `You don't own ${label}.eth domain`);
    const publicResolverAddress = await this.deployAndSetPublicResolver(label, node, tld);
    const registrarAddress = await this.deployNewRegistrar(node);
    await this.setRegistrarAsOwner(label, node, tld);
    return {publicResolverAddress, registrarAddress};
  }
}

export default DomainRegistrar;
