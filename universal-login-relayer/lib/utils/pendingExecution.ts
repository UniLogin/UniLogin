import WalletContract from 'universal-login-contracts/build/WalletContract.json';
import {utils, ContractFactory, Contract, Wallet} from 'ethers';
import {sortExecutionsByKey} from '../utils/utils';
import {concatenateSignatures} from 'universal-login-contracts';

export interface Message {
  gasToken: string;
  operationType: number;
  to: string;
  from: string;
  nonce: number | string;
  gasLimit: utils.BigNumberish;
  gasPrice: utils.BigNumberish;
  data: utils.Arrayish;
  value: utils.BigNumberish;
  signature: string;
}

export default class PendingExecution {
  private wallet: Wallet;
  private walletContract: Contract;
  private collectedSignatures: any;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatures = [];
  }

  async getStatus() {
    return {
      collectedSignatures: this.collectedSignatures,
      totalCollected: this.collectedSignatures.length,
      required: await this.walletContract.requiredSignatures()
    };
  }

  async push(msg: Message) {
    if (this.collectedSignatures.includes(msg.signature)) {
      throw 'signature already collected';
    }
    const key = await this.walletContract.getSigner(msg.from, msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType, msg.signature);
    if (await this.walletContract.getKeyPurpose(key) === 0) {
      throw 'invalid signature';
    }
    this.collectedSignatures.push({signature: msg.signature, key});
  }

  async canExecute() {
    return this.collectedSignatures.length >= await this.walletContract.requiredSignatures();
  }

  getConcatenatedSignatures() {
    const sortedExecutions = sortExecutionsByKey(this.collectedSignatures);
    const sortedSignatures = sortedExecutions.map((value: any) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}