import {Contract, providers, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {parseDomain, ENSDomainInfo} from '@universal-login/commons';
import ENS from '@universal-login/contracts/build/ENS.json';

export class ENSService {
  ens: Contract;
  domainsInfo: Record<string, ENSDomainInfo> = {};

  constructor(ensAddress: string, provider: providers.Provider) {
    this.ens = new Contract(ensAddress, ENS.interface, provider);
  }

  async getDomainInfo(domain: string) {
    if (this.domainsInfo[domain]) {
      return this.domainsInfo[domain];
    }
    const resolverAddress = await this.ens.resolver(utils.namehash(`${domain}`));
    const registrarAddress =  await this.ens.owner(utils.namehash(`${domain}`));
    this.domainsInfo[domain] = {resolverAddress, registrarAddress};
    return this.domainsInfo[domain];
  }

  async argsFor(ensName: string) {
    const [label, domain] = parseDomain(ensName);
    const domainInfo = await this.getDomainInfo(domain);
    if (domainInfo.registrarAddress === AddressZero || domainInfo.resolverAddress === AddressZero) {
      return null;
    }
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    return [hashLabel, ensName, node, this.ens.address, domainInfo.registrarAddress, domainInfo.resolverAddress];
  }
}
