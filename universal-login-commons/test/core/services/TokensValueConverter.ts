import {expect} from 'chai';
import {utils} from 'ethers';
import {TokenDetailsWithBalance} from '../../../lib/core/models/TokenData';
import {TokensValueConverter} from '../../../lib/core/services/TokensValueConverter';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import {TEST_CONTRACT_ADDRESS} from '../../../lib/core/constants/test';

describe('UNIT: TokensValueConverter', () => {
  const tokensValueConverter = new TokensValueConverter(['USD', 'DAI', 'ETH']);

  const currencyToValue = {USD: 2000, DAI: 1600, ETH: 1};
  const currencyToValueWithZeros = {USD: 0, DAI: 0, ETH: 0};

  context('getTokenTotalWorth', () => {
    it('0 ETH', () => {
      const actualEthTotalWorth = tokensValueConverter.getTokenTotalWorth(utils.parseEther('0'), currencyToValue);

      expect(actualEthTotalWorth).to.be.deep.equal(currencyToValueWithZeros);
    });

    it('2 ETH', () => {
      const actualEthTotalWorth = tokensValueConverter.getTokenTotalWorth(utils.parseEther('2'), currencyToValue);

      expect(actualEthTotalWorth).to.be.deep.equal({
        USD: 2 * currencyToValue.USD,
        DAI: 2 * currencyToValue.DAI,
        ETH: 2 * currencyToValue.ETH,
      });
    });
  });

  context('addBalances', () => {
    it('{USD, DAI, ETH} + {USD, DAI, ETH}', () => {
      const token2TotalWorth = {USD: 2 * 2000, DAI: 2 * 1600, ETH: 2 * 1};

      const tokensTotalWorth = tokensValueConverter.addBalances(currencyToValue, token2TotalWorth);

      expect(tokensTotalWorth).to.deep.equal({USD: 3 * 2000, DAI: 3 * 1600, ETH: 3 * 1, GBP: 3 * 1500});
    });
  });

  context('getTotal', () => {
    const etherAmount = 1;
    const mockTokenAmount = 2;

    const tokenDetailsWithBalance: TokenDetailsWithBalance[] = [
      {...ETHER_NATIVE_TOKEN, balance: utils.parseEther(etherAmount.toString())},
      {address: TEST_CONTRACT_ADDRESS, symbol: 'Mock', name: 'MockToken', balance: utils.parseEther(mockTokenAmount.toString())}
    ];

    const tokensPrices = {
      ETH: {USD: 1000, DAI: 800, ETH: 0.1, GBP: 500},
      Mock: {USD: 200, DAI: 160, ETH: 0.02, GBP: 150}
    };

    it('[]', async () => {
      const actualTotalWorth = tokensValueConverter.getTotal([], tokensPrices);

      expect(actualTotalWorth).to.be.deep.equal(currencyToValueWithZeros);
    });

    it('[ETH , DAI]', async () => {
      const expectedTotalWorth = {
        USD: etherAmount * tokensPrices.ETH.USD + mockTokenAmount * tokensPrices.Mock.USD,
        DAI: etherAmount * tokensPrices.ETH.DAI + mockTokenAmount * tokensPrices.Mock.DAI,
        ETH: etherAmount * tokensPrices.ETH.ETH + mockTokenAmount * tokensPrices.Mock.ETH,
      };

      const actualTotalWorth = tokensValueConverter.getTotal(tokenDetailsWithBalance, tokensPrices);

      expect(actualTotalWorth).to.be.deep.equal(expectedTotalWorth);
    });
  });
});
