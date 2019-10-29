import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpMethod} from '../../core/models/TopUpMethod';

export type TopUpAction = {
  type: 'SET_PROVIDER';
  provider: TopUpProvider | undefined;
} | {
  type: 'SET_AMOUNT';
  amount: string;
} | {
  type: 'SET_METHOD';
  method: TopUpMethod;
};
