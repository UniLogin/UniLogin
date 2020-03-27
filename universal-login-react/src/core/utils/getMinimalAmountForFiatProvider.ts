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
      const providerMinimalAmountInFiat = '30';
      const etherPriceInEUR = (await getEtherPriceInCurrency('EUR')).toString();
      const providerMinimalAmount = getPriceInEther(providerMinimalAmountInFiat, etherPriceInEUR);
      const requiredDeploymentBalanceAsBigNumber = utils.parseEther(requiredDeploymentBalance);
      const ethers = Number(utils.formatEther(bigNumberMax(
        requiredDeploymentBalanceAsBigNumber,
        providerMinimalAmount,
      )));
      const result = ethers * Number(etherPriceInEUR);
      return ValueRounder.ceil(result.toString(), 2);
    }
    default:
      return requiredDeploymentBalance;
  }
};
