import {RelayerRequest, http, HttpFunction} from '@universal-login/commons';
import {fetch} from './fetch';

export class RelayerApi {
  private http: HttpFunction;
  constructor(relayerUrl: string) {
    this.http = http(fetch)(relayerUrl);
  }

  async getConfig() {
    return this.http('GET', '/config');
  }

  async execute(message: any) {
    return this.http('POST', '/wallet/execution', message)
      .catch((e: any) => {
        // TODO: Maybe wrap this as a custom Error?
        throw new Error(e !== undefined && e.error);
      });
  }

  async getStatus(messageHash: string) {
    return this.http('GET', `/wallet/execution/${messageHash}`);
  }

  async connect(walletContractAddress: string, key: string) {
    return this.http('POST', '/authorisation', {
      walletContractAddress,
      key,
    });
  }

  async denyConnection(authorisationRequest: RelayerRequest) {
    const {contractAddress} = authorisationRequest;
    return this.http('POST', `/authorisation/${contractAddress}`, {
      authorisationRequest
    }).catch((e: any) => {
      throw new Error(e.error);
    });
  }

  async getPendingAuthorisations(authorisationRequest: RelayerRequest) {
    const {contractAddress, signature} = authorisationRequest;
    return this.http('GET', `/authorisation/${contractAddress}?signature=${signature}`);
  }

  async cancelConnection(authorisationRequest: RelayerRequest) {
    const {contractAddress} = authorisationRequest;
    return this.http('DELETE', `/authorisation/${contractAddress}`, {authorisationRequest});
  }

  async getConnectedDevices(deviceRequest: RelayerRequest) {
    const {contractAddress, signature} = deviceRequest;
    return this.http('GET', `/devices/${contractAddress}?signature=${signature}`);
  }

  async deploy(publicKey: string, ensName: string, gasPrice: string, signature: string) {
    return this.http('POST', '/wallet/deploy', {
      publicKey,
      ensName,
      gasPrice,
      signature
    });
  }
}
