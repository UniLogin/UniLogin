import {utils} from 'ethers';
import {DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE} from '../../core/constants/constants';
import {OPERATION_CALL} from '../../core/constants/contracts';
import {MessageWithFrom, UnsignedMessage} from '../../core/types/message';
import {calculateMessageSignature} from './calculateMessageSignature';


const emptyMessage = {
  to: '',
  value: utils.parseEther('0.0'),
  data: utils.formatBytes32String('0'),
  nonce: 0,
  gasPrice: utils.bigNumberify(DEFAULT_GAS_PRICE),
  gasLimit: utils.bigNumberify(DEFAULT_GAS_LIMIT),
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};


export const createSignedMessage = async (override: MessageWithFrom, privateKey: string) => {
  const message: UnsignedMessage = {...emptyMessage, ...override};
  const signature = await calculateMessageSignature(privateKey, message);
  return {...message, signature};
};
