import {Contract, providers, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {parseDomain, ENSDomainInfo, ensureNotNull} from '@universal-login/commons';
import ENS from '@universal-login/contracts/build/ENS.json';

export class ENSService {
  ens?: Contract;
  domainsInfo: Record<string, ENSDomainInfo> = {};

  constructor(private provider: providers.Provider, private ensAddress?: string) {
  }

  async getDomainInfo(domain: string) {
    if (this.domainsInfo[domain]) {
      return this.domainsInfo[domain];
    }
    const resolverAddress = await this.ens!.resolver(utils.namehash(`${domain}`));
    const registrarAddress =  await this.ens!.owner(utils.namehash(`${domain}`));
    this.domainsInfo[domain] = {resolverAddress, registrarAddress};
    return this.domainsInfo[domain];
  }

  async argsFor(ensName: string) {
    await this.getEns();
    const [label, domain] = parseDomain(ensName);
    const domainInfo = await this.getDomainInfo(domain);
    if (domainInfo.registrarAddress === AddressZero || domainInfo.resolverAddress === AddressZero) {
      return null;
    }
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    return [hashLabel, ensName, node, this.ens!.address, domainInfo.registrarAddress, domainInfo.resolverAddress];
  }

  async getEns() {
    if (!this.ensAddress) {
      this.ensAddress = (await this.provider.getNetwork()).ensAddress;
    }
    ensureNotNull(this.ensAddress, Error, 'Can not find ENS address');
    this.ens = this.ens || new Contract(this.ensAddress!, ENS.interface, this.provider);
  }
}
