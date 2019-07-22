import {Notification} from '@universal-login/commons';
import WalletService from '../../integration/storage/WalletService';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../config/TransactionDetails';

export default class NotificationsService {
  notifications: Notification[] = [];

  constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
  }

  subscribe (callback: (args: Notification[]) => void) {
    const {contractAddress, privateKey} =  this.walletService.applicationWallet!;
    const unsubscribe = this.sdk.subscribeAuthorisations(contractAddress, privateKey, callback);
    return unsubscribe;
  }

  async confirm (publicKey: string) {
    const {contractAddress, privateKey} =  this.walletService.applicationWallet!;
    const {waitToBeMined} = await this.sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
    return waitToBeMined();
  }

  async reject (publicKey: string) {
    const {contractAddress, privateKey} =  this.walletService.applicationWallet!;
    await this.sdk.denyRequest(contractAddress, publicKey, privateKey);
  }
}
