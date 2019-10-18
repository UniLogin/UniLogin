import {TopUpProvider} from '../models/TopUpProvider';

const providersUsedPrefilledAmount = [TopUpProvider.RAMP];

export const isPrefilledAmountUsedBy = (topUpProvider?: TopUpProvider) => {
  return !!topUpProvider && providersUsedPrefilledAmount.includes(topUpProvider);
};
