import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpMethod} from '../../core/models/TopUpMethod';

export interface TopUpState {
  provider: TopUpProvider | undefined;
  method: TopUpMethod;
  amount: string;
}

export const TOP_UP_INITIAL_STATE: TopUpState = {
  provider: undefined,
  method: undefined,
  amount: '',
};
