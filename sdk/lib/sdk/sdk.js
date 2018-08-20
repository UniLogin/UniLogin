import fetch from 'node-fetch';
import ethers from 'ethers';
import {waitForContractDeploy} from '../../lib/utils/utils';
import Identity from '../../build/Identity';

const MANAGEMENT_KEY = 1;
const ACTION_KEY = 2;
const ECDSA_TYPE = 1;

const headers = {'Content-Type': 'application/json; charset=utf-8'};

class EthereumIdentitySDK {
  constructor(relayerUrl, provider) {
    this.provider = provider;
    this.relayerUrl = relayerUrl;
  }

  async create() {
    const managementKey = this.generatePrivateKey();
    const url = `${this.relayerUrl}/identity`;
    const method = 'POST';
    const body = JSON.stringify({managementKey});
    const response = await fetch(url, {headers, method, body});
    const responseJson = await response.json();
    if (response.status === 201) {
      const contract = await waitForContractDeploy(this.provider, Identity, responseJson.transaction.hash);
      return [managementKey, contract.address];
    }
    throw new Error(`${response.status}`);
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
}

export default EthereumIdentitySDK;
export {MANAGEMENT_KEY, ACTION_KEY, ECDSA_TYPE};
