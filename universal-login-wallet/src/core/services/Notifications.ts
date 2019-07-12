import {Notification, CancelAuthorisationRequest, GetAuthorisationRequest, signGetAuthorisationRequest} from '@universal-login/commons';
import WalletService from '../../integration/storage/WalletService';
import UniversalLoginSDK from '@universal-login/sdk';
import {transactionDetails} from '../../config/TransactionDetails';

export default class NotificationsService {
  notifications: Notification[] = [];

  constructor (private sdk: UniversalLoginSDK, private walletService: WalletService) {
  }

  subscribe (callback: (args: Notification[]) => void) {
    const getAuthorisationRequest: GetAuthorisationRequest = {
      walletContractAddress: this.walletService.userWallet!.contractAddress,
      signature: ''
    };
    signGetAuthorisationRequest(getAuthorisationRequest, this.walletService.userWallet!.privateKey);

    const unsubscribe = this.sdk.subscribeAuthorisations(
      getAuthorisationRequest,
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
