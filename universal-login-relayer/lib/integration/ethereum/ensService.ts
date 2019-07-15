import {utils, Contract, providers} from 'ethers';
import ENS from '@universal-login/contracts/build/ENS.json';
import {parseDomain, resolveName, ENSDomainInfo} from '@universal-login/commons';

class ENSService {
  private domainsInfo : Record<string, ENSDomainInfo>  = {};

  private ens: Contract;

  constructor(private ensAddress: string, private ensRegistrars: string[], private provider: providers.Provider) {
    this.ens = new Contract(this.ensAddress, ENS.interface, this.provider);
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

  argsFor(ensName: string) {
    const [label, domain] = parseDomain(ensName);
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(`${label}.${domain}`);
    const registrarConfig = this.findRegistrar(domain);
    if (registrarConfig === null) {
      return null;
    }
    const {resolverAddress} = registrarConfig;
    const {registrarAddress} = registrarConfig;
    return [hashLabel, ensName, node, this.ensAddress, registrarAddress, resolverAddress];
  }

  resolveName = async (ensName: string) => {
    return resolveName(this.provider, this.ensAddress, ensName);
  }
}

export default ENSService;
