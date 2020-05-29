import {expect} from 'chai';
import {TokenDetails, ETHER_NATIVE_TOKEN, TEST_TOKEN_PRICE_IN_ETH, TEST_DAI_TOKEN} from '@unilogin/commons';
import {getValueInUsd} from '../../../src/core/utils/getValueInUsd';
import {utils} from 'ethers';

describe('UNIT: getValueInUsd', () => {
  const mockGetTokenPriceInEth = (tokenDetails: TokenDetails) => {
    if (tokenDetails.address === ETHER_NATIVE_TOKEN.address) {
      return 1;
    }
    return TEST_TOKEN_PRICE_IN_ETH;
  };

  const etherPriceInUsd = '200';

  const mockGetEtherPriceInCurrency = () => etherPriceInUsd;

  const mockGetTokenDetails = (tokenAddress: string) => {
    if (tokenAddress === ETHER_NATIVE_TOKEN.address) {
      return ETHER_NATIVE_TOKEN;
    }
    return TEST_DAI_TOKEN;
  };

  const walletService = {
    sdk: {
      tokenPricesService: {
        getTokenPriceInEth: mockGetTokenPriceInEth,
        getEtherPriceInCurrency: mockGetEtherPriceInCurrency,
      },
      tokenDetailsService: {
        getTokenDetails: mockGetTokenDetails,
      },
    },
  };

  const test = (currency: string) => (expectedUsdAmount: string, ethValue: string) => {
    it(`returns ${expectedUsdAmount} USD for ${ethValue} ${currency}`, async () => {
      expect(await getValueInUsd(
        currency === ETHER_NATIVE_TOKEN.symbol ? ETHER_NATIVE_TOKEN.address : TEST_DAI_TOKEN.address,
        walletService as any,
        utils.parseEther(ethValue).toString(),
      )).to.eq(expectedUsdAmount);
    });
  };

  const testETH = test('ETH');
  const testDAI = test('DAI');

  testETH('1000', '5');
  testETH('200', '1');
  testETH('4', '0.02');
  testETH('2', '0.01');
  testETH('0.2', '0.001');
  testETH('0.1', '0.0005');
  testETH('0.01', '0.00005');
  testETH('0.001', '0.000005');
  testETH('0.001', '0.00000005');
  testETH('0.001', '0.000000000001');

  testDAI('1000', '1000');
  testDAI('10', '10');
  testDAI('1', '1');
  testDAI('0.1', '0.1');
  testDAI('0.01', '0.01');
  testDAI('0.001', '0.001');
  testDAI('0.001', '0.0001');
  testDAI('0.001', '0.00001');
  testDAI('0.001', utils.formatEther('1'));
});
