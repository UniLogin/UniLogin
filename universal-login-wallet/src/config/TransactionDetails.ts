import {OPERATION_CALL} from '@universal-login/contracts';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';


export const transactionDetails = {
  gasPrice: 110000000,
  gasLimit: 1000000,
  gasToken: ETHER_NATIVE_TOKEN.address,
  operationType: OPERATION_CALL
};
