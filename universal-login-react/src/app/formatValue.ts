import {utils} from 'ethers';
import UniLoginSdk from '@unilogin/sdk';

export const formatValue = (sdk: UniLoginSdk, amount: string, currency: string) =>
  utils.parseUnits(amount, sdk.tokensDetailsStore.getTokenBy('symbol', currency).decimals).toString();
