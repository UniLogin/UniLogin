import {Notification} from '@universal-login/commons';
import WalletService from '../../integration/storage/WalletService';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../config/TransactionDetails';

export default class NotificationsService {
  notifications: Notification[] = [];

  constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
  }

  subscribe (callback: (args: Notification[]) => void) {
    const contractAddress: string = this.walletService.userWallet!.contractAddress;
    callback(this.notifications);
    const subscription = this.sdk.subscribe(
      'AuthorisationsChanged',
      {contractAddress},
      (authorisations: Notification[]) => {
        this.notifications = authorisations;
        callback(this.notifications);
      });
    return () => { subscription.remove(); };
  }

  async confirm (publicKey: string) {
    const {contractAddress, privateKey} =  this.walletService.userWallet!;
    const {waitForMined} = await this.sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
    return waitForMined();
  }

  async reject (publicKey: string) {
    await this.sdk.denyRequest(this.walletService.userWallet!.contractAddress, publicKey);
  }

}
