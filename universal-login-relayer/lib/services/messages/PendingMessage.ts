import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {Contract, Wallet} from 'ethers';
import {CollectedSignature} from './IPendingMessagesStore';

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

  async isEnoughSignatures(requiredSignatures? : Number) {
    const requiredSignaturesCount = requiredSignatures || await this.walletContract.requiredSignatures();
    return this.collectedSignatures.length >= requiredSignaturesCount;
  }
}
