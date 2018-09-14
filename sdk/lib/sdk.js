import ethers, {utils, Interface} from 'ethers';
import {addressToBytes32, waitForContractDeploy, messageSignature, sleep} from './utils/utils';
import Identity from '../abi/Identity';
import ENS from '../abi/ENS';
import PublicResolver from '../abi/PublicResolver';
import {EventEmitter} from 'fbemitter';
import RelayerObserver from './observers/RelayerObserver';


const {namehash} = utils;

const MANAGEMENT_KEY = 1;
const ACTION_KEY = 2;
const ECDSA_TYPE = 1;

const headers = {'Content-Type': 'application/json; charset=utf-8'};

class EthereumIdentitySDK {
  constructor(relayerUrl, provider) {
    this.provider = provider;
    this.relayerUrl = relayerUrl;
    this.pendingAuthorisationsIndexes = {};
    this.emitters = {};
    this.index = 0;
    this.step = 1000;
    this.state = 'stop';
    this.relayerObserver = new RelayerObserver(relayerUrl, provider);
  }

  async create(ensName) {
    const privateKey = this.generatePrivateKey();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const managementKey = wallet.address;
    const url = `${this.relayerUrl}/identity`;
    const method = 'POST';
    const body = JSON.stringify({managementKey, ensName});
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const contract = await waitForContractDeploy(this.provider, Identity, responseJson.transaction.hash);
      return [privateKey, contract.address];
    }
    throw new Error(`${response.status}`);
  }

  async addKey(to, publicKey, privateKey) {
    const key = addressToBytes32(publicKey);
    const {data} = new Interface(Identity.interface).functions.addKey(key, MANAGEMENT_KEY, ECDSA_TYPE);
    const message = {
      to,
      value: 0,
      data
    };
    return await this.execute(to, message, privateKey);
  }

  removeKey() {
    throw new Error('not yet implemented');
  }

  generatePrivateKey() {
    return ethers.Wallet.createRandom().privateKey;
  }

  async getRelayerConfig() {
    const url = `${this.relayerUrl}/config`;
    const method = 'GET';
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {headers, method});
    const responseJson = await response.json();
    if (response.status === 200) {
      return responseJson;
    }
    throw new Error(`${response.status}`);
  }

  async execute(contractAddress, message, privateKey) {
    const url = `${this.relayerUrl}/identity/execution`;
    const method = 'POST';
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const signature = messageSignature(wallet, message.to, message.value, message.data);
    const body = JSON.stringify({...message, contractAddress, signature});
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const receipt = await this.provider.getTransactionReceipt(responseJson.transaction.hash);
      return this.getExecutionNonce(receipt.logs);
    }
    throw new Error(`${response.status}`);
  }

  getExecutionNonce(emittedEvents) {
    const [eventTopic] = new Interface(Identity.interface).events.ExecutionRequested.topics;
    for (const event of emittedEvents) {
      if (event.topics[0] === eventTopic) {
        return utils.bigNumberify(event.topics[1]);
      }
    }
    throw 'Event ExecutionRequested not emitted';
  }

  async identityExist(identity) {
    const identityAddress = await this.getAddress(identity);
    if (identityAddress && this.codeEqual(Identity.runtimeBytecode, await this.getCode(identityAddress))) {
      return identityAddress;
    }
    return false;
  }

  codeEqual(runtimeBytecode, liveBytecode) {
    // TODO: verify if it is working
    const compareLength = runtimeBytecode.length - 68;
    return runtimeBytecode.slice(0, compareLength) === liveBytecode.slice(2, compareLength + 2);
  }

  async getAddress(identity) {
    const node = namehash(identity);
    const {ensAddress} = (await this.getRelayerConfig()).config;
    this.ensContract = new ethers.Contract(ensAddress, ENS.interface, this.provider);
    const resolverAddress = await this.ensContract.resolver(node);
    if (resolverAddress !== '0x0000000000000000000000000000000000000000') {
      this.resolverContract = new ethers.Contract(resolverAddress, PublicResolver.interface, this.provider);
      return await this.resolverContract.addr(node);
    }
    return false;
  }

  async getCode(address) {
    return await this.provider.getCode(address);
  }

  async requestAuthorisation(identityAddress, label = '') {
    const privateKey = this.generatePrivateKey();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const key = wallet.address;
    const url = `${this.relayerUrl}/authorisation`;
    const method = 'POST';
    const body = JSON.stringify({identityAddress, key, label});
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {headers, method, body});
    if (response.status === 201) {
      return privateKey;
    }
    throw new Error(`${response.status}`);
  }

  async getPendingAuthorisations(identityAddress) {
    const url = `${this.relayerUrl}/authorisation/${identityAddress}`;
    const method = 'GET';
    // eslint-disable-next-line no-undef
    const response = await fetch(url, {headers, method});
    const responseJson = await response.json();
    if (response.status === 200) {
      return responseJson.response;
    }
    throw new Error(`${response.status}`);
  }

  subscribe(eventType, identityAddress, callback) {
    this.relayerObserver.subscribe(eventType, identityAddress, callback);
  }

  start() {
    this.relayerObserver.start();
  }

  async checkAuthorisationRequests() {
    this.relayerObserver.checkAuthorisationRequests();
  }

  stop() {
    this.relayerObserver.stop();
  }

  async finalizeAndStop() {
    return this.relayerObserver.finalizeAndStop();
  }
}

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE};
