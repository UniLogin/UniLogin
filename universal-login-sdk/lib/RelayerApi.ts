import {http, HttpFunction} from './utils/http';

export class RelayerApi {
  private http: HttpFunction;
  constructor(relayerUrl: string) {
    this.http = http(relayerUrl);
  }

  async createWallet(managementKey: string, ensName: string) {
    return this.http('POST', '/wallet', {
      managementKey,
      ensName
    }).catch(e => {
      throw new Error(e != null && e.error)
    });
  }

  async getConfig() {
    return this.http('GET', '/config');
  }

  async execute(message: any) {
    return this.http('POST', '/wallet/execution', message)
      .catch(e => {
        throw new Error(e != null && e.error)
      });
  }

  async connect(identityAddress: string, key: string) {
    return this.http('POST', '/authorisation', {
      identityAddress,
      key,
    });
  }

  async denyConnection(identityAddress: string, key: string) {
    return this.http('POST', `/authorisation/${identityAddress}`, {
      identityAddress,
      key,
    });
  }
}
