import {expect} from 'chai';
import sinon from 'sinon';
import {TokensPrices, TEST_TOKEN_DETAILS, TEST_GAS_PRICES} from '@unilogin/commons';
import {GasModeService} from '../../../src/core/services/GasModeService';
import {utils} from 'ethers';
import {getMockedGasPriceOracle} from '@unilogin/commons/testutils';

describe('UNIT: GasModeService', () => {
  const tokensDetailsStore: any = {tokensDetails: TEST_TOKEN_DETAILS};

  const tokenPrices: TokensPrices = {
    ETH: {USD: 1838.51, DAI: 1494.71, SAI: 1494.71, ETH: 1},
    DAI: {USD: 0.2391, DAI: 1, SAI: 0.1942, ETH: 0.000669026098708},
    SAI: {USD: 0.2391, DAI: 0.1942, SAI: 1, ETH: 0.000669026098708},
  };

  const priceObserver: any = {
    getCurrentPrices: sinon.stub().resolves(tokenPrices),
  };

  const gasModeService = new GasModeService(tokensDetailsStore, getMockedGasPriceOracle(), priceObserver);

  const expectedModes = [
    {
      name: 'cheap',
      usdAmount: '0.00002941616',
      timeEstimation: '114',
      gasOptions: [{
        gasPrice: utils.bigNumberify('23915360000003'),
        token: TEST_TOKEN_DETAILS[0],
      },
      {
        gasPrice: TEST_GAS_PRICES.cheap.gasPrice,
        token: TEST_TOKEN_DETAILS[2],
      }],
    },
    {
      name: 'fast',
      usdAmount: '0.0000367702',
      timeEstimation: '30',
      gasOptions: [{
        gasPrice: utils.bigNumberify('29894200000004'),
        token: TEST_TOKEN_DETAILS[0],
      },
      {
        gasPrice: TEST_GAS_PRICES.fast.gasPrice,
        token: TEST_TOKEN_DETAILS[2],
      }],
    },
  ];

  it('getModesWithUsedPrices', async () => {
    const {modes, prices} = await gasModeService.getModesWithPrices();
    expect(modes).to.deep.eq(expectedModes);
    expect(prices).to.deep.eq(tokenPrices);
  });
});
