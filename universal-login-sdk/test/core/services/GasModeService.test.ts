import {expect} from 'chai';
import sinon from 'sinon';
import {TokensPrices, TEST_TOKEN_DETAILS} from '@unilogin/commons';
import {GasModeService} from '../../../src/core/services/GasModeService';
import {utils} from 'ethers';

describe('UNIT: GasModeService', () => {
  const tokensDetailsStore: any = {tokensDetails: TEST_TOKEN_DETAILS};

  const gasPrices = {
    cheap: {
      gasPrice: utils.bigNumberify('20000000000'),
      timeEstimation: '114',
    },
    fast: {
      gasPrice: utils.bigNumberify('24000000000'),
      timeEstimation: '30',
    },
  };
  const gasPriceOracle: any = {getGasPrices: sinon.stub().resolves(gasPrices)};

  const tokenPrices: TokensPrices = {
    ETH: {USD: 1838.51, DAI: 1494.71, SAI: 1494.71, ETH: 1},
    DAI: {USD: 0.2391, DAI: 1, SAI: 0.1942, ETH: 0.000669026098708},
    SAI: {USD: 0.2391, DAI: 0.1942, SAI: 1, ETH: 0.000669026098708},
  };

  const priceObserver: any = {
    getCurrentPrices: sinon.stub().resolves(tokenPrices),
  };

  const gasModeService = new GasModeService(tokensDetailsStore, gasPriceOracle, priceObserver);

  const expectedModes = [
    {
      name: 'cheap',
      usdAmount: '0.0000367702',
      timeEstimation: '114',
      gasOptions: [{
        gasPrice: utils.bigNumberify('29894200000004'),
        token: TEST_TOKEN_DETAILS[0],
      },
      {
        gasPrice: utils.bigNumberify('29894200000004'),
        token: TEST_TOKEN_DETAILS[1],
      },
      {
        gasPrice: gasPrices.cheap.gasPrice,
        token: TEST_TOKEN_DETAILS[2],
      }],
    },
    {
      name: 'fast',
      usdAmount: '0.00004412424',
      timeEstimation: '30',
      gasOptions: [{
        gasPrice: utils.bigNumberify('35873040000005'),
        token: TEST_TOKEN_DETAILS[0],
      },
      {
        gasPrice: utils.bigNumberify('35873040000005'),
        token: TEST_TOKEN_DETAILS[1],
      },
      {
        gasPrice: gasPrices.fast.gasPrice,
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
