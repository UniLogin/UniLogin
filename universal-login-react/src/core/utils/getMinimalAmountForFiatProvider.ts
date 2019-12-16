import {utils} from 'ethers';
import {getEtherPriceInCurrency} from '@universal-login/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';

export const getMinimalAmountForFiatProvider = async (paymentMethod: TopUpProvider, requiredDeploymentBalance: string) => {
  switch (paymentMethod) {
    case 'RAMP': {
      const providerMinimalAmountInFiat = '1';
      const etherPriceInGBP = await getEtherPriceInCurrency('GBP');
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInGBP);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      return requiredDeploymentBalanceAsBigNumber.gt(providerMinimalAmount)
        ? utils.formatEther(requiredDeploymentBalanceAsBigNumber)
        : utils.formatEther(providerMinimalAmount);
    }
    default:
      return requiredDeploymentBalance;
  }
};
