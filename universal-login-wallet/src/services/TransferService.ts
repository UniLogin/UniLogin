import UniversalLoginSDK from 'universal-login-sdk';
import WalletService from './WalletService';
import {utils} from 'ethers';
import MockContract from 'universal-login-commons/build/MockToken.json';

class TransferService {
  constructor(private sdk: UniversalLoginSDK, private walletService: WalletService) {}

  async transferTokens(to: string, amount: string, currency: string) {
    if (this.walletService.userWallet) {
      const data = new utils.Interface(MockContract.abi).functions.transfer.encode([to, utils.parseEther(amount)]);
      const message = {
        from: this.walletService.userWallet.contractAddress,
        to: currency, 
        value: 0,
        data,
        gasToken: currency
      }
      await this.sdk.execute(message, this.walletService.userWallet.privateKey);
    }
  }
}

export default TransferService;
