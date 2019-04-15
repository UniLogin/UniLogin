import {Procedure, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import WalletService from './WalletService';
import UniversalLoginSDK from '@universal-login/sdk';
import {OPERATION_CALL} from '@universal-login/contracts';

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

  confirm (walletContractAddress: string, publicKey: string) {
    const to = walletContractAddress;
    const {privateKey} =  this.walletService.userWallet!;
    const transactionDetails = {
      gasPrice: 31000000000000,
      gasLimit: 1000000,
      operationType: OPERATION_CALL,
      gasToken: ETHER_NATIVE_TOKEN.address
    };

    this.sdk.addKey(to, publicKey, privateKey, transactionDetails);
  }

  reject (walletContractAddress: string, publicKey: string) {
    return this.sdk.denyRequest(walletContractAddress, publicKey);
  }

}
