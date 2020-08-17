import {expect} from 'chai';
import {utils} from 'ethers';
import {TokenDetailsWithBalance} from '../../../src/core/models/TokenData';
import {TokensValueConverter} from '../../../src/core/services/TokensValueConverter';
import {ETHER_NATIVE_TOKEN} from '../../../src/core/constants/constants';
import {TEST_CONTRACT_ADDRESS, TEST_TOKEN_ADDRESS} from '../../../src/core/constants/test';

describe('UNIT: TokensValueConverter', () => {
  const tokensValueConverter = new TokensValueConverter(['USD', 'DAI', 'SAI', 'ETH']);

  const currencyToValue = {USD: 2000, DAI: 1600, SAI: 1600, ETH: 1};
  const currencyToValueWithZeros = {USD: 0, DAI: 0, SAI: 0, ETH: 0};

  context('getTokenTotalWorth', () => {
    it('0 ETH', () => {
      const actualEthTotalWorth = tokensValueConverter.getTokenTotalWorth({balance: utils.parseEther('0'), ...ETHER_NATIVE_TOKEN}, currencyToValue);

      expect(actualEthTotalWorth).to.deep.eq(currencyToValueWithZeros);
    });

    it('2 ETH', () => {
      const actualEthTotalWorth = tokensValueConverter.getTokenTotalWorth({balance: utils.parseEther('2'), ...ETHER_NATIVE_TOKEN}, currencyToValue);

      expect(actualEthTotalWorth).to.deep.eq({
        USD: 2 * currencyToValue.USD,
        DAI: 2 * currencyToValue.DAI,
        SAI: 2 * currencyToValue.SAI,
        ETH: 2 * currencyToValue.ETH,
      });
    });

    it('2 USDC with 6 decimals', () => {
      const actualEthTotalWorth = tokensValueConverter.getTokenTotalWorth({balance: utils.parseUnits('2', 6), name: 'USDC', symbol: 'USDC', address: TEST_TOKEN_ADDRESS, decimals: 6}, currencyToValue);

      expect(actualEthTotalWorth).to.deep.eq({
        USD: 2 * currencyToValue.USD,
        DAI: 2 * currencyToValue.DAI,
        SAI: 2 * currencyToValue.SAI,
        ETH: 2 * currencyToValue.ETH,
      });
    });
  });

  context('addBalances', () => {
    it('{USD, DAI, SAI, ETH} + {USD, DAI, SAI, ETH}', () => {
      const token2TotalWorth = {USD: 2 * 2000, DAI: 2 * 1600, SAI: 2 * 1600, ETH: 2 * 1};

      const tokensTotalWorth = tokensValueConverter.addBalances(currencyToValue, token2TotalWorth);

      expect(tokensTotalWorth).to.deep.eq({USD: 3 * 2000, DAI: 3 * 1600, SAI: 3 * 1600, ETH: 3 * 1});
    });
  });

  context('getTotal', () => {
    const etherAmount = 1;
    const mockTokenAmount = 2;

    const tokenDetailsWithBalance: TokenDetailsWithBalance[] = [
      {...ETHER_NATIVE_TOKEN, balance: utils.parseEther(etherAmount.toString())},
      {address: TEST_CONTRACT_ADDRESS, symbol: 'MockDAI', name: 'MockDAIToken', balance: utils.parseEther(mockTokenAmount.toString()), decimals: 18},
      {address: TEST_CONTRACT_ADDRESS, symbol: 'MockSAI', name: 'MockSAIToken', balance: utils.parseEther(mockTokenAmount.toString()), decimals: 18},
    ];

    const tokensPrices = {
      ETH: {USD: 1000, DAI: 800, SAI: 800, ETH: 0.1},
      MockDAI: {USD: 200, DAI: 160, SAI: 160, ETH: 0.02},
      MockSAI: {USD: 200, DAI: 160, SAI: 160, ETH: 0.02},
    };

    it('[]', async () => {
      const actualTotalWorth = tokensValueConverter.getTotal([], tokensPrices);

      expect(actualTotalWorth).to.deep.eq(currencyToValueWithZeros);
    });

    it('[ETH , DAI, SAI]', async () => {
      const expectedTotalWorth = {
        USD: etherAmount * tokensPrices.ETH.USD + mockTokenAmount * tokensPrices.MockDAI.USD + mockTokenAmount * tokensPrices.MockSAI.USD,
        DAI: etherAmount * tokensPrices.ETH.DAI + mockTokenAmount * tokensPrices.MockDAI.DAI + mockTokenAmount * tokensPrices.MockSAI.DAI,
        SAI: etherAmount * tokensPrices.ETH.SAI + mockTokenAmount * tokensPrices.MockDAI.SAI + mockTokenAmount * tokensPrices.MockSAI.SAI,
        ETH: etherAmount * tokensPrices.ETH.ETH + mockTokenAmount * tokensPrices.MockDAI.ETH + mockTokenAmount * tokensPrices.MockSAI.ETH,
      };

      const actualTotalWorth = tokensValueConverter.getTotal(tokenDetailsWithBalance, tokensPrices);

      expect(actualTotalWorth).to.deep.eq(expectedTotalWorth);
    });
  });
});
