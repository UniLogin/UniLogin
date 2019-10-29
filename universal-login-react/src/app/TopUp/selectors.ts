import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';
import {ButtonState} from '../../ui/TopUp/PayButton';
import {TopUpState} from './state';

export const isCorrectAmount = (state: TopUpState) => Number(state.amount) > 0;

export function getPayButtonState(
  state: TopUpState,
  topUpProviderSupportService: TopUpProviderSupportService,
): ButtonState {
  if (state.method !== 'fiat') {
    return 'hidden';
  }

  const isPayButtonDisabled = !state.provider ||
    (topUpProviderSupportService.isInputAmountUsed(state.provider) && !isCorrectAmount(state)) ||
    state.provider === TopUpProvider.WYRE;

  return isPayButtonDisabled ? 'disabled' : 'active';
}
