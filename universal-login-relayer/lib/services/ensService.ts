import {utils, Contract, providers} from 'ethers';
import ENS from '@universal-login/contracts/build/ENS.json';
import {parseDomain} from '@universal-login/commons';


interface DomainInfo {
  resolverAddress? : string;
  registrarAddress? : string;
}

interface DomainInfo {
  resolverAddress? : string;
  registrarAddress? : string;
}

class ENSService {
  private domainsInfo : Record<string, DomainInfo>  = {};
  private ens: Contract;
  constructor(private ensAddress: string, private ensRegistrars: string, private provider: providers.Provider) {
    this.ens = new Contract(this.ensAddress, ENS.interface, this.provider);
  }

  async start() {
    for (let count = 0; count < this.ensRegistrars.length; count++) {
      const domain = this.ensRegistrars[count];
      this.domainsInfo[`${domain}`] = {};
      this.domainsInfo[`${domain}`].resolverAddress = await this.ens.resolver(utils.namehash(`${domain}`));
      this.domainsInfo[`${domain}`].registrarAddress = await this.ens.owner(utils.namehash(`${domain}`));
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
}

export default ENSService;
