import {TopUpProvider} from './TopUpProvider';

export interface FiatOptions {
  topUpProvider?: TopUpProvider;
  amount: string;
}
