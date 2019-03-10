import {utils, Wallet, Contract, providers} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import {OPERATION_CALL, MANAGEMENT_KEY, ACTION_KEY, calculateMessageSignatures} from 'universal-login-contracts';
import {waitToBeMined, waitForContractDeploy} from 'universal-login-commons';
import {resolveName} from './utils/ethereum';
import RelayerObserver from './observers/RelayerObserver';
import BlockchainObserver from './observers/BlockchainObserver';
import {headers, fetch} from './utils/http';
import MESSAGE_DEFAULTS from './config';


class EthereumIdentitySDK {

  constructor(relayerUrl, providerOrUrl, paymentOptions) {
    this.provider = typeof(providerOrUrl) === 'string' ? new providers.JsonRpcProvider(providerOrUrl, {chainId: 0}) : providerOrUrl;
    this.relayerUrl = relayerUrl;
    this.relayerObserver = new RelayerObserver(relayerUrl);
    this.blockchainObserver = new BlockchainObserver(this.provider);
    this.defaultPaymentOptions = {...MESSAGE_DEFAULTS, ...paymentOptions};
  }

  async create(ensName) {
    const privateKey = this.generatePrivateKey();
    const wallet = new Wallet(privateKey, this.provider);
    const managementKey = wallet.address;
    const url = `${this.relayerUrl}/identity`;
    const method = 'POST';
    const body = JSON.stringify({managementKey, ensName});
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const contract = await waitForContractDeploy(this.provider, Identity, responseJson.transaction.hash);
      return [privateKey, contract.address];
    }
    throw new Error(`${responseJson.error}`);
  }

  async addKey(to, publicKey, privateKeys, transactionDetails, keyPurpose = MANAGEMENT_KEY) {
    const key = publicKey;
    const data = new utils.Interface(Identity.interface).functions.addKey.encode([key, keyPurpose]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data,
    };
    return this.execute(message, privateKeys);
  }

  async addKeys(to, publicKeys, privateKeys, transactionDetails, keyPurpose = MANAGEMENT_KEY) {
    const keys = publicKeys.map((publicKey) => publicKey);
    const keyRoles = new Array(publicKeys.length).fill(keyPurpose);
    const data = new utils.Interface(Identity.interface).functions.addKeys.encode([keys, keyRoles]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      data,
    };
    return this.execute(message, privateKeys);
  }

  async removeKey(to, address, privateKeys, transactionDetails) {
    const key = address;
    const data = new utils.Interface(Identity.interface).functions.removeKey.encode([key, MANAGEMENT_KEY]);
    const message = {
      ...transactionDetails,
      to,
      from: to,
      value: 0,
      data,
      operationType: OPERATION_CALL,
    };
    return this.execute(message, privateKeys);
  }

  generatePrivateKey() {
    return Wallet.createRandom().privateKey;
  }

  async getRelayerConfig() {
    const url = `${this.relayerUrl}/config`;
    const method = 'GET';
    const response = await fetch(url, {headers, method});
    const responseJson = await response.json();
    if (response.status === 200) {
      return responseJson;
    }
    throw new Error(`${response.status}`);
  }

  async execute(message, privateKeys) {
    const url = `${this.relayerUrl}/identity/execution`;
    const method = 'POST';
    const finalMessage = {
      ...this.defaultPaymentOptions,
      ...message,
      nonce: message.nonce || parseInt(await this.getNonce(message.from), 10),
    };
    const signature = await calculateMessageSignatures(privateKeys, finalMessage);
    const body = JSON.stringify({...finalMessage, signature});
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      await waitToBeMined(this.provider, responseJson.transaction.hash);
      return responseJson.transaction.hash;
    }
    throw new Error(`${responseJson.error}`);
  }

  async getNonce(identityAddress) {
    const contract = new Contract(identityAddress, Identity.interface, this.provider);
    return contract.lastNonce();
  }

  async identityExist(identity) {
    const identityAddress = await this.resolveName(identity);
    if (identityAddress && await this.provider.getCode(identityAddress)) {
      return identityAddress;
    }
    return false;
  }

  async resolveName(identity) {
    this.config = this.config || (await this.getRelayerConfig()).config;
    const {ensAddress} = this.config;
    return resolveName(this.provider, ensAddress, identity);
  }

  async connect(identityAddress) {
    const privateKey = this.generatePrivateKey();
    const wallet = new Wallet(privateKey, this.provider);
    const key = wallet.address.toLowerCase();
    const url = `${this.relayerUrl}/authorisation`;
    const method = 'POST';
    const body = JSON.stringify({identityAddress, key});
    const response = await fetch(url, {headers, method, body});
    if (response.status === 201) {
      return privateKey;
    }
    throw new Error(`${response.status}`);
  }

  async denyRequest(identityAddress, publicKey) {
    const url = `${this.relayerUrl}/authorisation/${identityAddress}`;
    const method = 'POST';
    const body = JSON.stringify({identityAddress, key: publicKey});
    const response = await fetch(url, {headers, method, body});
    if (response.status === 201) {
      return publicKey;
    }
    throw new Error(`${response.status}`);
  }

  async fetchPendingAuthorisations(identityAddress) {
    return this.relayerObserver.fetchPendingAuthorisations(identityAddress);
  }

  subscribe(eventType, filter, callback) {
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

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY};
export {SdkSigner} from './SdkSigner';
