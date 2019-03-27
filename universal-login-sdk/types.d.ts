import {providers} from 'ethers';
import {WalletExistenceVerifier} from 'universal-login-commons';

declare interface Subscription {
  remove(): void
}

declare class UniversalLoginSDK extends WalletExistenceVerifier  {
  public provider: providers.Provider;

  constructor(relayerUrl: string, providerOrUrl: string | providers.Provider, paymentOptions?: any);

  create(ensName: string): Promise<[string, string]>;

  addKey(to: string, publicKey: string, privateKey: string, transactionDetails: any, keyPurpose: 1 | 2 | 3): Promise<number>;

  addKeys(to: string, publicKeys: string[], privateKey: string, transactionDetails: any, keyPurpose: 1 | 2 | 3): Promise<number>;

  removeKey(to: string, address: string, privateKey: string, transactionDetails: any): Promise<number>;

  generatePrivateKey(): string;

  getRelayerConfig(): any;

  execute(message: any, privateKey: string): Promise<number>;

  getNonce(walletContractAddress: string, privateKey: string): Promise<number>;

  walletContractExist(identity: string): Promise<string | false>;

  resolveName(identity: string): Promise<string | false>;

  connect(walletContractAddress: string): Promise<string>;

  denyRequest(walletContractAddress: string, publicKey: string): Promise<string>;

  fetchPendingAuthorisations(walletContractAddress: string): Promise<any>;

  subscribe(eventType: string, filter: any, callback: (...args: any[]) => void): Subscription;

  start(): Promise<void>;

  stop(): void;

  finalizeAndStop(): Promise<void>;
}

export default UniversalLoginSDK;

export declare const MANAGEMENT_KEY = 1;
export declare const ACTION_KEY = 2;

export declare class SdkSigner extends ethers.Signer {
  public provider: providers.Provider;
  public contractAddress: string;

  constructor(
    sdk: UniversalLoginSDK,
    contractAddress: string,
    privateKey: string,
  )

  getAddress(): Promise<string>;

  signMessage(message: utils.Arrayish): Promise<string>;

  sendTransaction(transaction: providers.TransactionRequest): Promise<providers.TransactionResponse>;
}