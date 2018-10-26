import ethers, {utils} from 'ethers';
import ENS from '../../abi/ENS';
import PublicResolver from '../../abi/PublicResolver';

const {namehash} = utils;

class EnsService {
  constructor(sdk, provider) {
    this.sdk = sdk;
    this.provider = provider;
  }

  async getPublicResolverAddress() {
    this.relayerConfig = this.relayerConfig || await this.getEnsConfig();
    this.publicResolverAddress = this.relayerConfig.config.publicResolverAddress;
    return this.publicResolverAddress;
  }


  async getEnsConfig() {
    return await this.sdk.getRelayerConfig();
  }

  async getEnsName(address) {
    const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
    this.resolverContract = this.resolverContract || new ethers.Contract(await this.getPublicResolverAddress(), PublicResolver.interface, this.provider);
    return await this.resolverContract.name(node);
  }
}

export default EnsService;
