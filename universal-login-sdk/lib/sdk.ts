import {utils, Wallet, Contract, providers} from 'ethers';
import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {OPERATION_CALL, MANAGEMENT_KEY, ACTION_KEY, calculateMessageSignature, calculateMessageHash} from '@universal-login/contracts';
import {waitToBeMined, waitForContractDeploy, Message} from '@universal-login/commons';
import {resolveName} from './utils/ethereum';
import RelayerObserver from './observers/RelayerObserver';
import BlockchainObserver from './observers/BlockchainObserver';
import MESSAGE_DEFAULTS from './config';
import {RelayerApi} from './RelayerApi';

class UniversalLoginSDK {
  provider: providers.Provider;
  relayerApi: RelayerApi;
  relayerObserver: RelayerObserver;
  blockchainObserver: BlockchainObserver;
  defaultPaymentOptions: Partial<Message>;
  config: any;

  constructor(
    relayerUrl: string,
    providerOrUrl: string | providers.Provider,
    paymentOptions?: Partial<Message>,
  ) {
    this.provider = typeof(providerOrUrl) === 'string' ?
      new providers.JsonRpcProvider(providerOrUrl, {chainId: 0} as any)
      : providerOrUrl;
    this.relayerApi = new RelayerApi(relayerUrl);
    this.relayerObserver = new RelayerObserver(this.relayerApi);
    this.blockchainObserver = new BlockchainObserver(this.provider);
    this.defaultPaymentOptions = {...MESSAGE_DEFAULTS, ...paymentOptions};
  }

  async create(ensName: string): Promise<[string, string]> {
    const {address, privateKey} = Wallet.createRandom();
    const result = await this.relayerApi.createWallet(address, ensName);
    const contract = await waitForContractDeploy(
      this.provider,
      WalletContract,
      result.transaction.hash,
    );
    return [privateKey, contract.address];
  }

  async addKey(
    to: string,
    publicKey: string,
    privateKey: string,
    transactionDetails: Partial<Message>,
    keyPurpose = MANAGEMENT_KEY,
  ) {
    const key = publicKey;
    const data = new utils.Interface(WalletContract.interface).functions.addKey.encode([key, keyPurpose]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data,
    };
    return this.execute(message, privateKey);
  }

  async addKeys(
    to: string,
    publicKeys: string[],
    privateKey: string,
    transactionDetails: Message,
    keyPurpose = MANAGEMENT_KEY,
  ) {
    const keys = publicKeys.map((publicKey) => publicKey);
    const keyRoles = new Array(publicKeys.length).fill(keyPurpose);
    const data = new utils.Interface(WalletContract.interface).functions.addKeys.encode([keys, keyRoles]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data,
    };
    return this.execute(message, privateKey);
  }

  async removeKey(
    to: string,
    address: string,
    privateKey: string,
    transactionDetails: Message,
  ) {
    const key = address;
    const data = new utils.Interface(WalletContract.interface).functions.removeKey.encode([key, MANAGEMENT_KEY]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      value: 0,
      data,
      operationType: OPERATION_CALL,
    };
    return this.execute(message, privateKey);
  }

  async setRequiredSignatures(
    to: string,
    requiredSignatures: number,
    privateKey: string,
    transactionDetails: Message,
  ) {
    const data = new utils.Interface(WalletContract.interface).functions.setRequiredSignatures.encode([requiredSignatures]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      value: 0,
      data,
      operationType: OPERATION_CALL,
    };
    return this.execute(message, privateKey);
  }

  async getMessageStatus(message: Message) {
    const hash = calculateMessageHash(message);
    return this.relayerApi.getStatus(hash);
  }

  generatePrivateKey() {
    return Wallet.createRandom().privateKey;
  }

  async getRelayerConfig() {
    return this.relayerApi.getConfig();
  }

  async execute(message: Partial<Message>, privateKey: string) {
    const finalMessage = {
      ...this.defaultPaymentOptions,
      ...message,
      nonce: message.nonce || parseInt(await this.getNonce(message.from!, privateKey), 10),
    };
    const signature = await calculateMessageSignature(privateKey, finalMessage as any);

    const result = await this.relayerApi.execute({
      ...finalMessage,
      signature,
    });

    if (result.transaction.hash) {
      const transactionHash = result.transaction.hash;
      await waitToBeMined(this.provider, transactionHash);
      return transactionHash;
    }
    return result;
  }

  async getNonce(walletContractAddress: string, privateKey: string) {
    const wallet = new Wallet(privateKey, this.provider);
    const contract = new Contract(walletContractAddress, WalletContract.interface, wallet);
    return contract.lastNonce();
  }

  async getWalletContractAddress(ensName: string) {
    const walletContractAddress = await this.resolveName(ensName);
    if (walletContractAddress && await this.provider.getCode(walletContractAddress)) {
      return walletContractAddress;
    }
    return null;
  }

  async walletContractExist(ensName: string) {
    const walletContractAddress = await this.getWalletContractAddress(ensName);
    return walletContractAddress !== null;
  }

  async resolveName(ensName: string) {
    this.config = this.config || (await this.getRelayerConfig()).config;
    const {ensAddress} = this.config;
    return resolveName(this.provider, ensAddress, ensName);
  }

  async connect(walletContractAddress: string) {
    const {address, privateKey} = Wallet.createRandom();
    await this.relayerApi.connect(walletContractAddress, address.toLowerCase());
    return privateKey;
  }

  async denyRequest(walletContractAddress: string, key: string) {
    await this.relayerApi.denyConnection(walletContractAddress, key);
    return key;
  }

  async fetchPendingAuthorisations(walletContractAddress: string) {
    return this.relayerObserver.fetchPendingAuthorisations(walletContractAddress);
  }

  subscribe(eventType: string, filter: any, callback: Function) {
    if (['AuthorisationsChanged'].includes(eventType)) {
      return this.relayerObserver.subscribe(eventType, filter, callback);
    } else if (['KeyAdded', 'KeyRemoved'].includes(eventType)) {
      return this.blockchainObserver.subscribe(eventType, filter, callback);
    }
    throw `Unknown event type: ${eventType}`;
  }

  async start() {
    await this.relayerObserver.start();
    await this.blockchainObserver.start();
  }

  stop() {
    this.relayerObserver.stop();
    this.blockchainObserver.stop();
  }

  async finalizeAndStop() {
    await this.relayerObserver.finalizeAndStop();
    await this.blockchainObserver.finalizeAndStop();
  }
}

export default UniversalLoginSDK;
export {MANAGEMENT_KEY, ACTION_KEY};
export {SdkSigner} from './SdkSigner';
