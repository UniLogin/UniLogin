import {providers} from 'ethers';

declare interface Subscription {
  remove(): void
}

declare class EthereumIdentitySDK {
  constructor(relayerUrl: string, providerOrUrl: string | providers.Provider, paymentOptions: any);

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