import {OPERATION_CALL} from '@universal-login/contracts';
import {ETHER_NATIVE_TOKEN, Message} from '@universal-login/commons';


export const transactionDetails: Message = {
  gasPrice: 110000000,
  gasLimit: 1000000,
  gasToken: ETHER_NATIVE_TOKEN.address,
  operationType: OPERATION_CALL
};
