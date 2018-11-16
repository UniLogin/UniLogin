import {utils} from 'ethers';

class ENSService {
  constructor(ensAddress, ensRegistrars) {
    this.ensRegistrars = ensRegistrars;
    this.ensAddress = ensAddress;
  }

  findRegistrar(ensName) {
    const [, domain] = this.get2ndLevelDomainForm(ensName);
    return this.ensRegistrars[domain] || null;
  }

  get2ndLevelDomainForm(ensName) {
    const labels = ensName.split('.');
    const {length} = labels;
    const label = labels.slice(0, length - 2).join('.');
    const domain = labels.slice(length - 2, length).join('.');
    return [label, domain];
  }

  argsFor(ensName) {
    const [label, domain] = this.get2ndLevelDomainForm(ensName);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${domain}`);
    const registrarConfig = this.findRegistrar(ensName);
    if (registrarConfig === null) {
      return null;
    }
    const {resolverAddress} = registrarConfig;
    const {registrarAddress} = registrarConfig;
    return [hashLabel, ensName, node, this.ensAddress, registrarAddress, resolverAddress];
  }
}

export default ENSService;
