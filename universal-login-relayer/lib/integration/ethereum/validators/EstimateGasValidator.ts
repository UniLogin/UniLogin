import {Wallet, providers, utils} from 'ethers';
import {SignedMessage, ensure} from '@universal-login/commons';
import IMessageValidator from '../../../core/services/validators/IMessageValidator';
import {messageToTransaction} from '../../../core/utils/messages/serialisation';
import {NotEnoughGas} from '../../../core/utils/errors';

export default class EstimateGasValidator implements IMessageValidator {
  constructor(private wallet: Wallet) {}

  async validate(signedMessage: SignedMessage) {
    const transactionReq: providers.TransactionRequest = messageToTransaction(signedMessage);
    const estimateGas = await this.wallet.provider.estimateGas({ ...transactionReq, from: this.wallet.address });
    const totalGas = utils.bigNumberify(signedMessage.gasLimitExecution).add(utils.bigNumberify(signedMessage.gasData));
    ensure(totalGas.gte(estimateGas), NotEnoughGas);
  }
}
