import WalletContract from '@universal-login/contracts/build/WalletMaster.json';
import {Contract, Wallet} from 'ethers';
import {CollectedSignatureKeyPair} from './IPendingMessagesStore';

export default class PendingMessage {
  private wallet: Wallet;
  public walletContract: Contract;
  public collectedSignatureKeyPairs: CollectedSignatureKeyPair[];
  public transactionHash: string;

  constructor(walletAddress: string, wallet: Wallet) {
    this.wallet = wallet;
    this.walletContract = new Contract(walletAddress, WalletContract.interface, this.wallet);
    this.collectedSignatureKeyPairs = [];
    this.transactionHash = '0x0';
  }
}
