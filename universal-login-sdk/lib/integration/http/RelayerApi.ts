import {CancelAuthorisationRequest, GetAuthorisationRequest, http, HttpFunction} from '@universal-login/commons';
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

  async denyConnection(cancelAuthorisationRequest: CancelAuthorisationRequest) {
    const {walletContractAddress} = cancelAuthorisationRequest;
    return this.http('POST', `/authorisation/${walletContractAddress}`, {
      cancelAuthorisationRequest
    }).catch((e: any) => {
      throw new Error(e.error);
    });
  }

  async getPendingAuthorisations(getAuthorisationRequest: GetAuthorisationRequest) {
    const {walletContractAddress, signature} = getAuthorisationRequest;
    return this.http('GET', `/authorisation/${walletContractAddress}?signature=${signature}`);
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
