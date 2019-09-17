import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensure} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {messageToTransaction} from '../../../core/utils/utils';
import {NotEnoughGas} from '../../../core/utils/errors';

export default class EnoughGasValidator implements IMessageValidator {
  constructor(private wallet: Wallet) {}

  async validate(signedMessage: SignedMessage) {
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    const estimateGas = await this.wallet.provider.estimateGas({ ...transactionReq, from: this.wallet.address });
    ensure(utils.bigNumberify(signedMessage.gasLimitExecution as utils.BigNumberish).gte(estimateGas), NotEnoughGas); // TODO Add gasData to gasLimitExecution !!!!
  }
}
