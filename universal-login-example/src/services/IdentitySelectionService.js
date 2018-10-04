import {ensDomains} from '../../config/config';

class IdentitySelectionService {
  constructor(sdk, domains = ensDomains) {
    this.domains = domains;
    this.sdk = sdk;
  }

  isFullDomain(name) {
    return name.endsWith('.eth');
  }

  countPeriods(name) {
    return name.split('.').length - 1;
  }

  isCorrectPrefix(prefix) {
    return /^\w+\.?(\w+)?\.?e?t?h?$/.test(prefix);
  }

  async splitByExistence(domains) {
    const connections = [];
    const creations = [];
    for (const domain of domains) {
      if (await this.sdk.identityExist(domain)) {
        connections.push(domain);
      } else {
        creations.push(domain);
      }
    }
    return [connections, creations];
  }

  async getSuggestionsForNodePrefix(nodePrefix) {
    const domains = this.domains
      .map((domain) => `${nodePrefix}.${domain}`);
    return this.splitByExistence(domains);
  }

  async getSuggestionsForNodeAndSldPrefix(node, sldPrefix) {
    const domains = this.domains
      .filter((domain) => domain.startsWith(sldPrefix))
      .map((domain) => `${node}.${domain}`);
    return this.splitByExistence(domains);
  }

  async getConnects(namePrefix) {
    return (await this.getSuggestions(namePrefix))[0];
  }

  async getCreates(namePrefix) {
    return (await this.getSuggestions(namePrefix))[1];
  }

  async getSuggestions(namePrefix) {
    if (!this.isCorrectPrefix(namePrefix)) {
      return [[], []];
    } else if (this.isFullDomain(namePrefix)) {
      return (await this.sdk.identityExist(namePrefix)) ? [[namePrefix], []]: [[], [namePrefix]];
    } else  if (this.countPeriods(namePrefix) > 0) {
      const [name, sldPrefix] = namePrefix.split('.');
      return await this.getSuggestionsForNodeAndSldPrefix(name, sldPrefix);
    } else {
      return await this.getSuggestionsForNodePrefix(namePrefix);
    }
  }
}

export default IdentitySelectionService;