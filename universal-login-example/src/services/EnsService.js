import {utils, Contract} from 'ethers';
import PublicResolver from '../../abi/PublicResolver';
import ENS from 'universal-login-contracts/build/ENS';

const {namehash} = utils;

class EnsService {
  constructor(sdk, provider, config) {
    this.sdk = sdk;
    this.provider = provider;
    this.config = config;
    this.ens = new Contract(this.config.ensAddress, ENS.interface, this.provider);
  }

  async getPublicResolverAddress() {
    this.publicResolverAddress = this.publicResolverAddress || await this.ens.resolver(namehash(this.config.ensDomains[0]));
    return this.publicResolverAddress;
  }

  async getEnsName(address) {
    const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
    this.resolverContract = this.resolverContract || new Contract(await this.getPublicResolverAddress(), PublicResolver.interface, this.provider);
    return await this.resolverContract.name(node);
  }
}

export default EnsService;
