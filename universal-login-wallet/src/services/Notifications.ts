import {Procedure, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import WalletService from './WalletService';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../config/TransactionDetails';

export default class NotificationsService {
  notifications = [];

  constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
  }

  subscribe (callback: Procedure) {
    callback(this.notifications);
    const subscription = this.sdk.subscribe(
      'AuthorisationsChanged',
      {contractAddress: this.walletService.userWallet!.contractAddress},
      (authorisations: any) => {
        this.notifications = authorisations;
        callback(this.notifications);
      });
    return () => { subscription.remove(); };
  }

  async confirm (publicKey: string) {
    const {contractAddress, privateKey} =  this.walletService.userWallet!;
    await this.sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
  }

  reject (walletContractAddress: string, publicKey: string) {
    return this.sdk.denyRequest(walletContractAddress, publicKey);
  }

}
