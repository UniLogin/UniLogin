import {TopUpProvider} from '../../core/models/TopUpProvider';
import {TopUpProviderSupportService} from '../../core/services/TopUpProviderSupportService';
import {ButtonState} from '../../ui/TopUp/PayButton';
import {TopUpMethod} from '../../core/models/TopUpMethod';

export function getPayButtonState(
  paymentMethod: TopUpProvider | undefined,
  topUpProviderSupportService: TopUpProviderSupportService,
  amount: string,
  topUpMethod: TopUpMethod,
): ButtonState {
  if (topUpMethod !== 'fiat') {
    return 'hidden';
  }

  const isPayButtonDisabled = !paymentMethod ||
    (topUpProviderSupportService.isInputAmountUsed(paymentMethod) && Number(amount) <= 0);

  return isPayButtonDisabled ? 'disabled' : 'active';
}
