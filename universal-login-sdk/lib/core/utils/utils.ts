import {utils} from 'ethers';
import {Message, UnsignedMessage} from '@universal-login/commons';
import {fillGasEstimatesToUnsignedMessage} from '@universal-login/contracts';

export const messageToUnsignedMessage = (message: Partial<Message>): UnsignedMessage => {
  const messageWithoutGasEstimates = {
    to: message.to!,
    from: message.from!,
    value: message.value || utils.bigNumberify(0),
    data: message.data || '0x',
    nonce: message.nonce!,
    gasPrice: message.gasPrice!,
    gasToken: message.gasToken!,
    gasData: 0,
    gasLimitExecution: 0
  };

  return fillGasEstimatesToUnsignedMessage(messageWithoutGasEstimates, message.gasLimit!);
};
