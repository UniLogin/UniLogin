import {http, HttpFunction} from './utils/http';
import { CancelAuthorisationRequest, GetAuthorisationRequest } from '@universal-login/commons';

export class RelayerApi {
  private http: HttpFunction;
  constructor(relayerUrl: string) {
    this.http = http(relayerUrl);
  }

  async createWallet(managementKey: string, ensName: string) {
    return this.http('POST', '/wallet', {
      managementKey,
      ensName
    }).catch((e) => {
      // TODO: Maybe wrap this as a custom Error?
      throw new Error(e !== undefined && e.error);
    });
  }

  async getConfig() {
    return this.http('GET', '/config');
  }

  async execute(message: any) {
    return this.http('POST', '/wallet/execution', message)
      .catch((e) => {
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
    }).catch((e) => {
      throw new Error(e.error);
    });
  }

  async getPendingAuthorisations(getAuthorisationRequest: GetAuthorisationRequest) {
    const {walletContractAddress, signature} = getAuthorisationRequest;
    return this.http('GET', `/authorisation/${walletContractAddress}?signature=${signature}`)
      .catch((e) => {
        return {};
      });
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
