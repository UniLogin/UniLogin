import {Message, UnsignedMessage, computeGasData} from '@universal-login/commons';
import {utils} from 'ethers';

export const messageToUnsignedMessage = (message: Partial<Message>): UnsignedMessage => {
  const gasLimit = utils.bigNumberify(message.gasLimit!);
  const gasData = computeGasData((message.data || '0x') as string);
  const gasLimitExecution = gasLimit.sub(gasData);

  return {
    to: message.to!,
    from: message.from!,
    value: message.value || utils.bigNumberify(0),
    data: message.data || '0x',
    nonce: message.nonce!,
    gasPrice: message.gasPrice!,
    gasToken: message.gasToken!,
    gasData,
    gasLimitExecution
  };
};
