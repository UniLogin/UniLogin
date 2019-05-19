import {transferMessage} from '../fixtures/basicWalletContract';
import {calculateMessageSignature} from '@universal-login/contracts';
import {Message, PartialRequired} from '@universal-login/commons';

export const createSignedMessage = async (override: PartialRequired<Message, 'from'>, privateKey: string) => {
  const message = { ...transferMessage, signature: '0x', ...override};
  const signature = await calculateMessageSignature(privateKey, message);
  return {...message, signature};
};

export default createSignedMessage;