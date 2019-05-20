
import {calculateMessageSignature, OPERATION_CALL} from '@universal-login/contracts';
import {Message, PartialRequired} from '@universal-login/commons';
import { utils } from 'ethers';
import DEFAULT_PAYMENT_OPTIONS from '../config/defaultPaymentOptions';

const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

const emptyMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: utils.parseEther('0.0'),
  data: utils.formatBytes32String('0'),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};


export const createSignedMessage = async (override: PartialRequired<Message, 'from'>, privateKey: string) => {
  const message = { ...emptyMessage, signature: '0x', ...override};
  const signature = await calculateMessageSignature(privateKey, message);
  return {...message, signature};
};

export default createSignedMessage;