import {TopUpProvider} from '../models/TopUpProvider';

export const isInputAmountUsed = (topUpProvider?: TopUpProvider) => {
  return !!topUpProvider && [TopUpProvider.RAMP].includes(topUpProvider);
};
