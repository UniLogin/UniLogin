import {SignedMessage} from '@universal-login/commons';
import {encodeDataForExecuteSigned} from '@universal-login/contracts';
import {utils} from 'ethers';
import {GAS_LIMIT_MARGIN} from '../../core/utils/messages/serialisation';

export class MessageConverter {
  messageToTransaction = (message: SignedMessage) => Object({
    gasPrice: message.gasPrice,
    gasLimit: utils.bigNumberify(message.safeTxGas).add(message.baseGas).add(GAS_LIMIT_MARGIN),
    to: message.from,
    value: 0,
    data: encodeDataForExecuteSigned(message),
  });
}
