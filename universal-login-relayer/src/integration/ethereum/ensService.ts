import {utils, Contract, providers} from 'ethers';
import {ENSInterface} from '@unilogin/contracts';
import {parseDomain, resolveName, ENSDomainInfo, ensure} from '@unilogin/commons';
import {InvalidENSDomain, EnsNameTaken} from '../../core/utils/errors';

class ENSService {
  private domainsInfo: Record<string, ENSDomainInfo> = {};

  private ens: Contract;

  constructor(private ensAddress: string, private ensRegistrars: string[], private provider: providers.Provider) {
    this.ens = new Contract(this.ensAddress, ENSInterface, this.provider);
  }

  async start() {
    for (let count = 0; count < this.ensRegistrars.length; count++) {
      const domain = this.ensRegistrars[count];
      const resolverAddress = await this.ens.resolver(utils.namehash(domain));
      const registrarAddress = await this.ens.owner(utils.namehash(domain));
      this.domainsInfo[domain] = {registrarAddress, resolverAddress};
    }
  }

  findRegistrar(domain: string) {
    return this.domainsInfo[domain] || null;
  }

  async argsFor(ensName: string) {
    ensure(!await this.resolveName(ensName), EnsNameTaken, ensName);
    const [label, domain] = parseDomain(ensName);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${domain}`);
    const registrarConfig = this.findRegistrar(domain);
    ensure(registrarConfig !== null, InvalidENSDomain, ensName);
    const {resolverAddress} = registrarConfig;
    const {registrarAddress} = registrarConfig;
    return [hashLabel, ensName, node, this.ensAddress, registrarAddress, resolverAddress];
  }

  resolveName(ensName: string) {
    return resolveName(this.provider, this.ensAddress, ensName);
  }
}

export default ENSService;
