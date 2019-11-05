import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, ETHER_NATIVE_TOKEN, PaymentOptions} from '@universal-login/commons';

export const paymentOptions: PaymentOptions = {
  gasPrice: DEFAULT_GAS_PRICE,
  gasLimit: DEFAULT_GAS_LIMIT,
  gasToken: ETHER_NATIVE_TOKEN.address,
};
