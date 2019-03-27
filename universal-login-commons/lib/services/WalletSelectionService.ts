export interface WalletExistenceVerifier {
  walletContractExist(domain : string): Promise<string | false>;
}

const ensDomains = ['mylogin.eth'];

export class WalletSelectionService {
  domains: string[];
  sdk: WalletExistenceVerifier;

  constructor(sdk: WalletExistenceVerifier, domains: string[] = ensDomains) {
    this.domains = domains;
    this.sdk = sdk;
  }

  isCorrectDomainPrefix(domain: string) {
    return this.domains
      .filter((element: string) => element.startsWith(domain))
      .length > 0;
  }

  isCorrectTld(tld: string) {
    return 'test'.startsWith(tld) || 'eth'.startsWith(tld) || 'xyz'.startsWith(tld);
  }

  isCorrectPrefix(prefix: string) {
    const splitted = prefix.split('.');
    if (splitted.length === 0 || splitted.length > 3) {
      return false;
    }
    if (!/^\w[\w-]*$/.test(splitted[0])) {
      return false;
    }
    if (splitted.length > 1 && !/^[\w-]*$/.test(splitted[1])) {
      return this.isCorrectDomainPrefix(splitted[1]);
    }
    if (splitted.length > 2) {
      if (splitted[1].length === 0) {
        return false;
      }
      return this.isCorrectTld(splitted[2]);
    }
    return true;
  }

  async splitByExistence(domains: string[]) {
    const connections = [];
    const creations = [];
    for (const domain of domains) {
      if (await this.sdk.walletContractExist(domain)) {
        connections.push(domain);
      } else {
        creations.push(domain);
      }
    }
    return {connections, creations};
  }

  async getSuggestionsForNodePrefix(nodePrefix: string) {
    const domains = this.domains
      .map((domain) => `${nodePrefix}.${domain}`);
    return this.splitByExistence(domains);
  }

  async getSuggestionsForNodeAndSldPrefix(node: string, sldPrefix: string) {
    const domains = this.domains
      .filter((domain) => domain.startsWith(sldPrefix))
      .map((domain) => `${node}.${domain}`);
    return this.splitByExistence(domains);
  }

  async getSuggestions(namePrefix: string) {
    const splitted = namePrefix.split('.');
    const [name, domain, tld] = splitted;
    if (!this.isCorrectPrefix(namePrefix)) {
      return {connections: [], creations: []};
    }
    if (splitted.length === 1) {
      return this.getSuggestionsForNodePrefix(namePrefix);
    } else if (splitted.length === 2) {
      return this.isCorrectDomainPrefix(domain) ?
        this.getSuggestionsForNodeAndSldPrefix(name, domain) :
        {connections: [], creations: []};
    } else if (splitted.length === 3) {
      if (!this.isCorrectDomainPrefix(`${domain}.`)) {
        return {connections: [], creations: []};
      } else if (this.isCorrectTld(tld)) {
        if (tld.length < 3) {
          return this.getSuggestionsForNodeAndSldPrefix(name, domain);
        }
        return (await this.sdk.walletContractExist(namePrefix)) ?
          {connections: [namePrefix], creations: []} :
          {connections: [], creations: [namePrefix]};
      }
    }
  }
}
