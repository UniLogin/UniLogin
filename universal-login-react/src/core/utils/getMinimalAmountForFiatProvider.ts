import {utils} from 'ethers';
import {getEtherPriceInCurrency, bigNumberMax} from '@unilogin/sdk';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {getPriceInEther} from './getPriceInEther';
import {ValueRounder} from '@unilogin/commons';

export const getMinimalAmountForFiatProvider = async (paymentMethod: TopUpProvider, requiredDeploymentBalance: string) => {
  switch (paymentMethod) {
    case 'RAMP': {
      const providerMinimalAmountInFiat = '1';
      const etherPriceInGBP = (await getEtherPriceInCurrency('GBP')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInGBP);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      return utils.formatEther(bigNumberMax(
        requiredDeploymentBalanceAsBigNumber,
        providerMinimalAmount,
      ));
    }
    case 'SAFELLO': {
      const providerMinimalAmountInFiat = '1';
      const etherPriceInGBP = (await getEtherPriceInCurrency('GBP')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInGBP);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      const ethers = Number(utils.formatEther(bigNumberMax(
        requiredDeploymentBalanceAsBigNumber,
        providerMinimalAmount,
      )));
      const minimumForSafello = 30;
      const ethersInGBP = ethers*Number(etherPriceInGBP);
      const result = ethersInGBP > minimumForSafello ? ethersInGBP : minimumForSafello;
      return ValueRounder.ceil(result.toString(), 2);
    }
    default:
      return requiredDeploymentBalance;
  }
};
