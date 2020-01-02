import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensure, IMessageValidator} from '@universal-login/commons';
import {NotEnoughGas} from '../../../core/utils/errors';
import {WalletContractService} from '../WalletContractService';
import {MessageConverter} from '../MessageConverter';

export default class EstimateGasValidator implements IMessageValidator {
  constructor(private wallet: Wallet, private walletContractService: WalletContractService, private messageConverter: MessageConverter) {}

  async validate(signedMessage: SignedMessage) {
    ensure(utils.bigNumberify(signedMessage.gasPrice).gt(0), NotEnoughGas);
    const transactionReq: providers.TransactionRequest = this.messageConverter.messageToTransaction(signedMessage);
    let messageHash;
    try {
      messageHash = await this.wallet.provider.call({...transactionReq, from: this.wallet.address}); // TODO estimate gas
    } catch (e) {
      throw new NotEnoughGas();
    }
    const calculatedMessageHash = this.walletContractService.calculateMessageHash(signedMessage);
    ensure(messageHash === calculatedMessageHash, NotEnoughGas);
  }
}
