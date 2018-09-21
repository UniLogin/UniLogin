import ethers, {utils} from 'ethers';
import ENS from '../../abi/ENS';
import PublicResolver from '../../abi/PublicResolver';

const {namehash} = utils;

class EnsService {
  constructor(sdk, provider) {
    this.sdk = sdk;
    this.provider = provider;
  }

  async getEnsAddress() {
    this.ensConfig = this.ensConfig || await this.getEnsConfig();
    this.ensAddress = this.ensConfig.config.ensAddress;
    return this.ensAddress;
  }

  async getEnsConfig() {
    return await this.sdk.getRelayerConfig();
  }

  async getEnsName(address) {
    const node = namehash(`${address.slice(2)}.addr.reverse`.toLowerCase());
    this.ensContract = this.ensContract || new ethers.Contract(await this.getEnsAddress(), ENS.interface, this.provider);
    const resolverAddress = await this.ensContract.resolver(node);
    this.resolverContract = this.resolverContract || new ethers.Contract(resolverAddress, PublicResolver.interface, this.provider);
    return await this.resolverContract.name(node);
  }
}

export default EnsService;
