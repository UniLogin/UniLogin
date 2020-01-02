import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensure, IMessageValidator} from '@universal-login/commons';
import {messageToTransaction} from '../../../core/utils/messages/serialisation';
import {NotEnoughGas} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';

export default class EstimateGasValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private walletContractService: WalletContractService) {}

  async validate(signedMessage: SignedMessage) {
    ensure(utils.bigNumberify(signedMessage.gasPrice).gt(0), NotEnoughGas);
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    let messageHash;
    try {
      messageHash = await this.wallet.provider.call({...transactionReq, from: this.wallet.address}); // TODO estimate gas
    } catch (e) {
      throw new NotEnoughGas();
    }
    const calculatedMessageHash = await this.walletContractService.calculateMessageHash(signedMessage);
    ensure(messageHash === calculatedMessageHash, NotEnoughGas);
  }
}
