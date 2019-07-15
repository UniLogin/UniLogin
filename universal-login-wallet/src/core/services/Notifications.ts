import {Notification, CancelAuthorisationRequest} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import WalletService from '../../integration/storage/WalletService';
import {transactionDetails} from '../../config/TransactionDetails';

export default class NotificationsService {
  notifications: Notification[] = [];

  constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
  }

  subscribe (callback: (args: Notification[]) => void) {
    const contractAddress: string = this.walletService.userWallet!.contractAddress;
    const unsubscribe = this.sdk.subscribeAuthorisations(
      contractAddress,
      callback);
    return unsubscribe;
  }

  async confirm (publicKey: string) {
    const {contractAddress, privateKey} =  this.walletService.userWallet!;
    const {waitToBeMined} = await this.sdk.addKey(contractAddress, publicKey, privateKey, transactionDetails);
    return waitToBeMined();
  }

  async reject (publicKey: string) {
    const {privateKey} =  this.walletService.userWallet!;
    const cancelAuthorisationRequest: CancelAuthorisationRequest = {
      walletContractAddress: this.walletService.userWallet!.contractAddress,
      publicKey,
      signature: ''
    };
    await this.sdk.denyRequest(cancelAuthorisationRequest, privateKey);
  }
}
