import {TopUpState} from './state';
import {TopUpAction} from './actions';

export function topUpReducer(state: TopUpState, action: TopUpAction): TopUpState {
  switch (action.type) {
    case 'SET_PROVIDER':
      return {...state, provider: action.provider};
    case 'SET_AMOUNT':
      return {...state, amount: action.amount};
    case 'SET_METHOD':
      return {...state, method: action.method};
    default:
      return state;
  }
}
