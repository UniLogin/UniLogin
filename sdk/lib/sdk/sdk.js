import fetch from 'node-fetch';
import ethers, {utils, Interface} from 'ethers';
import {waitForContractDeploy, messageSignature} from '../../lib/utils/utils';
import Identity from '../../build/Identity';
import {getWallets} from 'ethereum-waffle';

const MANAGEMENT_KEY = 1;
const ACTION_KEY = 2;
const ECDSA_TYPE = 1;

const headers = {'Content-Type': 'application/json; charset=utf-8'};

class EthereumIdentitySDK {
  constructor(relayerUrl, provider) {
    this.provider = provider;
    this.relayerUrl = relayerUrl;
  }

  async create(ensName) {
    const privateKey = this.generatePrivateKey();
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const managementKey = wallet.address;
    const url = `${this.relayerUrl}/identity`;
    const method = 'POST';
    const body = JSON.stringify({managementKey, ensName});
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const contract = await waitForContractDeploy(this.provider, Identity, responseJson.transaction.hash);
      this.send(contract.address);
      return [privateKey, contract.address];
    }
    throw new Error(`${response.status}`);
  }

  async send(contractAddress) {
    const [sponsor] = await getWallets(this.provider);
    sponsor.send(contractAddress, 10000);
  }

  addKey() {
    throw new Error('not yet implemented');
  }

  removeKey() {
    throw new Error('not yet implemented');
  }

  generatePrivateKey() {
    return ethers.Wallet.createRandom().privateKey;
  }

  async execute(contractAddress, message, privateKey) {
    const url = `${this.relayerUrl}/identity/execution`;
    const method = 'POST';
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const signature = messageSignature(wallet, message.to, message.value, message.data);
    const body = JSON.stringify({...message, contractAddress, signature});
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
}

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE};
