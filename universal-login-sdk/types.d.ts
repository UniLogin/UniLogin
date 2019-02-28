import {providers} from 'ethers';
import {WalletExistenceVerifier} from 'universal-login-commons';

declare interface Subscription {
  remove(): void
}

declare class EthereumIdentitySDK extends WalletExistenceVerifier  {
  constructor(relayerUrl: string, providerOrUrl: string | providers.Provider, paymentOptions?: any);

  create(ensName: string): Promise<[string, string]>;

  addKey(to: string, publicKey: string, privateKey: string, transactionDetails: any, keyPurpose: 1 | 2 | 3): Promise<number>;

  addKeys(to: string, publicKeys: string[], privateKey: string, transactionDetails: any, keyPurpose: 1 | 2 | 3): Promise<number>;

  removeKey(to: string, address: string, privateKey: string, transactionDetails: any): Promise<number>;

  generatePrivateKey(): string;

  getRelayerConfig(): any;

  execute(message: any, privateKey: string): Promise<number>;

  getNonce(identityAddress: string, privateKey: string): Promise<number>;

  identityExist(identity: string): Promise<string | false>;

  resolveName(identity: string): Promise<string | false>;

  connect(identityAddress: string): Promise<string>;

  denyRequest(identityAddress: string, publicKey: string): Promise<string>;

  fetchPendingAuthorisations(identityAddress: string): Promise<any>;

  subscribe(eventType: string, filter: any, callback: (...args: any[]) => void): Subscription;

  start(): Promise<void>;

  stop(): void;

  finalizeAndStop(): Promise<void>;
}

export default EthereumIdentitySDK;

export declare const MANAGEMENT_KEY = 1;
export declare const ACTION_KEY = 2;
export declare const ECDSA_TYPE = 1;

export declare class SdkSigner extends ethers.Signer {
  public provider: providers.Provider;
  public contractAddress: string;

  constructor(
    sdk: EthereumIdentitySDK,
    contractAddress: string,
    privateKey: string,
  )

  getAddress(): Promise<string>;

  signMessage(message: utils.Arrayish): Promise<string>;

  sendTransaction(transaction: providers.TransactionRequest): Promise<providers.TransactionResponse>;
}