import {Contract, providers, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {parseDomain, ENSDomainInfo, addressEquals} from '@unilogin/commons';
import {ENSInterface, gnosisSafe} from '@unilogin/contracts';

export class ENSService {
  private ens: Contract;
  domainsInfo: Record<string, ENSDomainInfo> = {};

  constructor(provider: providers.Provider, ensAddress: string, public readonly ensRegistrarAddress: string) {
    this.ens = new Contract(ensAddress, ENSInterface, provider);
  }

  async getDomainInfo(domain: string) {
    if (this.domainsInfo[domain]) {
      return this.domainsInfo[domain];
    }
    const resolverAddress = await this.ens.resolver(utils.namehash(domain));
    const registrarAddress = await this.ens.owner(utils.namehash(domain));
    this.domainsInfo[domain] = {resolverAddress, registrarAddress};
    return this.domainsInfo[domain];
  }

  async argsFor(ensName: string) {
    const [label, domain] = parseDomain(ensName);
    const domainInfo = await this.getDomainInfo(domain);
    if (addressEquals(domainInfo.registrarAddress, AddressZero) || addressEquals(domainInfo.resolverAddress, AddressZero)) {
      return null;
    }
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    return [hashLabel, ensName, node, this.ens.address, domainInfo.registrarAddress, domainInfo.resolverAddress];
  }

  async getRegistrarData(ensName: string) {
    const args = await this.argsFor(ensName);
    return new utils.Interface(gnosisSafe.ENSRegistrar.interface as any).functions.register.encode(args as string[]);
  }
}
