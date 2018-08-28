import ethers, {utils} from 'ethers';
import FIFSRegistrar from '../../../build/FIFSRegistrar';
import PublicResolver from '../../../build/PublicResolver';
import ENS from '../../../build/ENS';

class ENSService {
  constructor(provider, ensAddress, ensRegistrars) {
    this.ensRegistrars = ensRegistrars;
    this.provider = provider;
    this.ensAddress = ensAddress;
  }

  async register(ensName, address) {
    const [label, domain] = this.get2ndLevelDomainForm(ensName);
    const registrarConfig = this.findRegistrar(ensName);
    const {privateKey} = registrarConfig;
    const {registrarAddress} = registrarConfig;
    const {resolverAddress} = registrarConfig;
    await this.doRegister(privateKey, registrarAddress, resolverAddress, label, domain, address);
  }

  async doRegister(privateKey, registrarAddress, resolverAddress, label, domain, address) {
    const node = utils.namehash(`${label}.${domain}`);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));

    const wallet = new ethers.Wallet(privateKey, this.provider);
    const registrar = new ethers.Contract(registrarAddress, FIFSRegistrar.interface, wallet);
    const resolver = new ethers.Contract(resolverAddress, PublicResolver.interface, wallet);
    const ens = new ethers.Contract(this.ensAddress, ENS.interface, wallet);

    await registrar.register(hashLabel, wallet.address);
    await ens.setResolver(node, resolverAddress);
    await resolver.setAddr(node, address);
  }

  findRegistrar(ensName) {
    const [, domain] = this.get2ndLevelDomainForm(ensName);
    return this.ensRegistrars[domain];
  }

  get2ndLevelDomainForm(ensName) {
    const labels = ensName.split('.');
    const {length} = labels;
    const label = labels.slice(0, length - 2).join('.');
    const domain = labels.slice(length - 2, length).join('.');
    return [label, domain];
  }
}

export default ENSService;
