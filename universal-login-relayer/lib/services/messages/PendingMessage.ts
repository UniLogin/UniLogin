import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {Contract, Wallet} from 'ethers';
import {sortExecutionsByKey} from '../../utils/utils';
import {concatenateSignatures} from '@universal-login/commons';
import {NotEnoughSignatures, TransactionAlreadyConfirmed, InvalidTransaction} from '../../utils/errors';

export type CollectedSignature = {
  key: string;
  signature: string;
};

export default class PendingMessage {
  private wallet: Wallet;
  public walletContract: Contract;
  public collectedSignatures: CollectedSignature[];
  public transactionHash: string;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatures = [];
    this.transactionHash = '0x0';
  }

  containSignature = (signature: string) =>
    this.collectedSignatures
      .filter((message: CollectedSignature) => message.signature === signature)
      .length > 0

  async getStatus() {
    return {
      collectedSignatures: [...this.collectedSignatures].map((execution) => execution.signature),
      totalCollected: this.collectedSignatures.length,
      required: await this.walletContract.requiredSignatures(),
      transactionHash: this.transactionHash
    };
  }

  async isEnoughSignatures(requiredSignatures? : Number) {
    const requiredSignaturesCount = requiredSignatures || await this.walletContract.requiredSignatures();
    return this.collectedSignatures.length >= requiredSignaturesCount;
  }

  confirmExecution(transactionHash: string) {
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
    const sortedSignatures = sortedExecutions.map((value: CollectedSignature) => value.signature);
    return concatenateSignatures(sortedSignatures);
  }
}
