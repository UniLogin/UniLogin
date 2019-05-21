import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {utils, Contract, Wallet} from 'ethers';
import {sortExecutionsByKey} from '../utils/utils';
import {concatenateSignatures, calculateMessageHash, SignedMessage} from '@universal-login/commons';
import {InvalidSignature, DuplicatedSignature, DuplicatedExecution, NotEnoughSignatures, TransactionAlreadyConfirmed, InvalidTransaction} from './errors';

type Execution = Record<string, string>;

export default class PendingExecution {
  private wallet: Wallet;
  private walletContract: Contract;
  private collectedSignatures: Execution[];
  private transactionHash: string;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatures = [];
    this.transactionHash = '0x0';
  }

  containSignature = (signature: string) =>
    this.collectedSignatures
      .filter((message: Execution) => message.signature === signature)
      .length > 0

  async getStatus() {
    return {
      collectedSignatures: [...this.collectedSignatures].map((execution) => execution.signature),
      totalCollected: this.collectedSignatures.length,
      required: await this.walletContract.requiredSignatures(),
      transactionHash: this.transactionHash
    };
  }

  async push(msg: SignedMessage) {
    if (this.transactionHash !== '0x0') {
      throw new DuplicatedExecution();
    }
    if (this.containSignature(msg.signature)) {
      throw new DuplicatedSignature();
    }
    const key = utils.verifyMessage(utils.arrayify(calculateMessageHash(msg)), msg.signature);
    const keyPurpose = await this.walletContract.getKeyPurpose(key);
    if (keyPurpose.eq(0)) {
      throw new InvalidSignature('Invalid key purpose');
    }
    this.collectedSignatures.push({signature: msg.signature, key});
  }

  async isEnoughSignatures(requiredSignatures? : Number) {
    const requiredSignaturesCount = requiredSignatures || await this.walletContract.requiredSignatures();
    return this.collectedSignatures.length >= requiredSignaturesCount;
  }

  async confirmExecution(transactionHash: string) {
    if (transactionHash.length !== 66) {
      throw new InvalidTransaction(transactionHash);
    }
    this.transactionHash = transactionHash;
  }

  public async ensureCorrectExecution() {
    const requiredSignatures = await this.walletContract.requiredSignatures();
    if (!(await this.isEnoughSignatures(requiredSignatures))) {
      throw new NotEnoughSignatures(requiredSignatures, this.collectedSignatures.length);
    }
    else if (this.transactionHash !== '0x0') {
      throw new TransactionAlreadyConfirmed('0x0');
    }
  }

  getConcatenatedSignatures() {
    const sortedExecutions = sortExecutionsByKey([...this.collectedSignatures]);
    const sortedSignatures = sortedExecutions.map((value: Execution) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}
