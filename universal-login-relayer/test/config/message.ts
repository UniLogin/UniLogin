import {transferMessage} from '../fixtures/basicWalletContract';
import {calculateMessageSignature} from '@universal-login/contracts';

export const getMessageWith = async (from: string, privateKey : string) => {
  const message = { ...transferMessage, signature: '0x', from};
  const signature = await calculateMessageSignature(privateKey, message);
  return {...message, signature};
};

export default getMessageWith;