import WalletContract from 'universal-login-contracts/build/Wallet.json';
import {utils, ContractFactory, Contract, Wallet} from 'ethers';
import {sortExecutionsByKey} from '../utils/utils';
import {concatenateSignatures} from 'universal-login-contracts';
import {Message} from 'universal-login-commons';

export default class PendingExecution {
  private wallet: Wallet;
  private walletContract: Contract;
  private collectedSignatures: any;
  private tx: string;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatures = [];
    this.tx = '0x0';
  }

  containSignature(signature: any) {
    for (let i = this.collectedSignatures.length - 1; i >= 0; i--) {
      if (this.collectedSignatures[i].signature === signature) {
        return true;
      }
    }
    return false;
  }

  async getStatus() {
    return {
      collectedSignatures: this.collectedSignatures,
      totalCollected: this.collectedSignatures.length,
      required: await this.walletContract.requiredSignatures(),
      tx: this.tx
    };
  }

  async push(msg: Message) {
    if (this.tx !== '0x0') {
      throw 'Execution request already processed';
    }
    if (this.containSignature(msg.signature)) {
      throw 'Signature already collected';
    }
    const key = await this.walletContract.getSigner(msg.from, msg.to, msg.value, msg.data, msg.nonce, msg.gasPrice, msg.gasToken, msg.gasLimit, msg.operationType, msg.signature);
    const keyPurpose = await this.walletContract.getKeyPurpose(key);
    if (keyPurpose.eq(0)) {
      throw 'Invalid signature';
    }
    this.collectedSignatures.push({signature: msg.signature, key});
  }

  async canExecute() {
    const requiredSignatures = await this.walletContract.requiredSignatures();
    return this.collectedSignatures.length >= requiredSignatures;
  }

  async confirmExecution(tx: string) {
    const requiredSignatures = await this.walletContract.requiredSignatures();
    if (requiredSignatures > this.collectedSignatures.length) {
      throw 'Not enough signatures';
    } else if (this.tx !== '0x0') {
      throw 'Transaction has already been confirmed';
    } else if (tx.length !== 66) {
      throw 'Invalid Tx';
    }
    this.tx = tx;
  }

  getConcatenatedSignatures() {
    const sortedExecutions = sortExecutionsByKey(this.collectedSignatures);
    const sortedSignatures = sortedExecutions.map((value: any) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}
