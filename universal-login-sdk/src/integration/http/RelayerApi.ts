import {http, HttpFunction, PublicRelayerConfig, RelayerRequest, ApplicationInfo, MessageStatus, DeploymentStatus, Device, StoredFutureWalletRequest, fetch, COMMON_HEADERS, SerializableRequestedCreatingWallet, SerializableRequestedRestoringWallet, StoredEncryptedWallet} from '@unilogin/commons';

export class RelayerApi {
  private readonly http: HttpFunction;
  constructor(relayerUrl: string, private apiKey?: string) {
    this.http = http(fetch)(relayerUrl);
  }

  private getHeaders() {
    return this.apiKey ? {...COMMON_HEADERS, api_key: this.apiKey} : COMMON_HEADERS;
  }

  getConfig(): Promise<PublicRelayerConfig> {
    return this.http('GET', '/config');
  }

  execute(message: any) {
    return this.http('POST', '/wallet/execution', message, this.getHeaders())
      .catch((e: any) => {
        // TODO: Maybe wrap this as a custom Error?
        throw new Error(e !== undefined && e.error);
      });
  }

  getStatus(messageHash: string): Promise<MessageStatus> {
    return this.http('GET', `/wallet/execution/${messageHash}`);
  }

  connect(walletContractAddress: string, key: string, applicationInfo: ApplicationInfo): Promise<void> {
    return this.http('POST', '/authorisation', {
      walletContractAddress,
      key,
      applicationInfo,
    });
  }

  denyConnection(authorisationRequest: RelayerRequest): Promise<void> {
    const {contractAddress} = authorisationRequest;
    return this.http('POST', `/authorisation/${contractAddress}`, {
      authorisationRequest,
    }).catch((e: any) => {
      throw new Error(e.error);
    });
  }

  getPendingAuthorisations(authorisationRequest: RelayerRequest) {
    const {contractAddress, signature} = authorisationRequest;
    return this.http('GET', `/authorisation/${contractAddress}?signature=${signature}`);
  }

  cancelConnection(authorisationRequest: RelayerRequest): Promise<void> {
    const {contractAddress} = authorisationRequest;
    return this.http('DELETE', `/authorisation/${contractAddress}`, {authorisationRequest});
  }

  getConnectedDevices(deviceRequest: RelayerRequest): Promise<Device[]> {
    const {contractAddress, signature} = deviceRequest;
    return this.http('GET', `/devices/${contractAddress}?signature=${signature}`);
  }

  deploy(publicKey: string, ensName: string, gasPrice: string, gasToken: string, signature: string, applicationInfo: ApplicationInfo, contractAddress: string) {
    return this.http('POST', '/wallet/deploy', {
      publicKey,
      ensName,
      gasPrice,
      gasToken,
      signature,
      applicationInfo,
      contractAddress,
    }, this.getHeaders());
  }

  getDeploymentStatus(deploymentHash: string): Promise<DeploymentStatus> {
    return this.http('GET', `/wallet/deploy/${deploymentHash}`);
  }

  addFutureWallet(storedFutureWallet: StoredFutureWalletRequest) {
    return this.http('POST', '/wallet/future', storedFutureWallet);
  }

  requestEmailConfirmationForCreating(serializableRequestedCreatingWallet: SerializableRequestedCreatingWallet) {
    return this.http('POST', '/email/request/creating', serializableRequestedCreatingWallet)
      .catch((e: any) => {
        throw new Error(e.error);
      });
  }

  async requestEmailConfirmationForRestoring(serializableRequestedRestoringWallet: SerializableRequestedRestoringWallet) {
    try {
      return await this.http('POST', '/email/request/restoring', serializableRequestedRestoringWallet);
    } catch (e) {
      throw new Error(e.error);
    };
  }

  confirmCode(code: string, ensNameOrEmail: string) {
    return this.http('POST', '/email/confirmation', {code, ensNameOrEmail})
      .catch((e: any) => {
        throw new Error(e.error);
      });
  }

  storeEncryptedWallet(storedEncryptedWallet: StoredEncryptedWallet, code: string) {
    return this.http('POST', '/wallet/encrypted', storedEncryptedWallet, {...COMMON_HEADERS, code});
  }

  restoreWallet(code: string, ensNameOrEmail: string) {
    return this.http('GET', `/wallet/restore/${ensNameOrEmail}`, undefined, {...COMMON_HEADERS, code})
      .catch((e: any) => {
        throw new Error(e.error);
      });
  }
}
