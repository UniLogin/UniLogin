import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {utils, Contract, Wallet} from 'ethers';
import {sortExecutionsByKey} from '../utils/utils';
import {concatenateSignatures, calculateMessageHash} from '@universal-login/contracts';
import {Message} from '@universal-login/commons';

export default class PendingExecution {
  private wallet: Wallet;
  private walletContract: Contract;
  private collectedSignatures: any;
  private transactionHash: string;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatures = [];
    this.transactionHash = '0x0';
  }

  containSignature = (signature: any) =>
    this.collectedSignatures
      .filter((message: any) => message.signature === signature)
      .length > 0

  async getStatus() {
    return {
      collectedSignatures: [...this.collectedSignatures].map((execution) => execution.signature),
      totalCollected: this.collectedSignatures.length,
      required: await this.walletContract.requiredSignatures(),
      transactionHash: this.transactionHash
    };
  }

  async push(msg: Message) {
    if (this.transactionHash !== '0x0') {
      throw 'Execution request already processed';
    }
    if (this.containSignature(msg.signature)) {
      throw 'Signature already collected';
    }
    const key = utils.verifyMessage(utils.arrayify(calculateMessageHash(msg)), msg.signature);
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
    } else if (this.transactionHash !== '0x0') {
      throw 'Transaction has already been confirmed';
    } else if (tx.length !== 66) {
      throw 'Invalid Tx';
    }
    this.transactionHash = tx;
  }

  getConcatenatedSignatures() {
    const sortedExecutions = sortExecutionsByKey([...this.collectedSignatures]);
    const sortedSignatures = sortedExecutions.map((value: any) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}
