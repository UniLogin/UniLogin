import UniversalLoginSDK from 'universal-login-sdk';
import WalletService from './WalletService';
import {utils} from 'ethers';
import MockContract from 'universal-login-commons/build/MockToken.json';
import { BigNumber } from '../../../node_modules/ethers/utils';

export class TransferService {
  private privateKey: string;
  private contractAddress: string;

  constructor(private sdk: UniversalLoginSDK, private walletService: WalletService) {
    this.privateKey = this.walletService.userWallet ? this.walletService.userWallet.privateKey : '';
    this.contractAddress = this.walletService.userWallet ? this.walletService.userWallet.contractAddress : '';
  }

  async transfer(to: string, amount: BigNumber, currency: string) {
    const data = new utils.Interface(MockContract.abi).functions.transfer.encode([to, amount]);
    const message = {
      from: this.contractAddress,
      to: currency, 
      value: 0,
      data,
      gasToken: currency
    }
    await this.sdk.execute(message, this.privateKey);
  }
}