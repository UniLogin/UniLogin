import {ensDomains} from '../../config/config';

class IdentitySelectionService {
  constructor(sdk, domains = ensDomains) {
    this.domains = domains;
    this.sdk = sdk;
  }

  isFullDomain(name) {
    return name.endsWith('.eth') || name.endsWith('.test') || name.endsWith('.xyz');
  }

  countPeriods(name) {
    return name.split('.').length - 1;
  }

  isCorrectPrefix(prefix) {
    const splitted = prefix.split('.');    
    if (splitted.length === 0 || splitted.length > 3) {
      return false;
    } 
    if (!/^\w[\w-]*$/.test(splitted[0])) {
      return false;
    }
    if (splitted.length > 1 && !/^[\w-]*$/.test(splitted[1])) {
      return false;
    }
    if (splitted.length > 2) {
      if (splitted[1].length === 0) {
        return false;
      }
      return 'test'.startsWith(splitted[2]) || 'eth'.startsWith(splitted[2]) || 'xyz'.startsWith(splitted[2]);
    }
    return true;
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
    return {connections, creations};
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
    return (await this.getSuggestions(namePrefix)).connections;
  }

  async getCreates(namePrefix) {
    return (await this.getSuggestions(namePrefix)).creations;
  }

  async getSuggestions(namePrefix) {
    if (!this.isCorrectPrefix(namePrefix)) {
      return {connections: [], creations: []};
    } else if (this.isFullDomain(namePrefix)) {
      return (await this.sdk.identityExist(namePrefix)) ? 
        {connections: [namePrefix], creations: []} : 
        {connections: [], creations: [namePrefix]};
    } else  if (this.countPeriods(namePrefix) > 0) {
      const [name, sldPrefix] = namePrefix.split('.');
      return await this.getSuggestionsForNodeAndSldPrefix(name, sldPrefix);
    }
    return await this.getSuggestionsForNodePrefix(namePrefix);
  }
}

export default IdentitySelectionService;
