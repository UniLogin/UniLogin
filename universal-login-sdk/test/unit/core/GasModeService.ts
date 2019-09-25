import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {TokensPrices, TEST_TOKEN_DETAILS} from '@universal-login/commons';
import {GasModeService} from '../../../lib/core/services/GasModeService';
import {utils} from 'ethers';

chai.use(sinonChai);

describe('UNIT: GasModeService', () => {
  const tokensDetailsStore: any = {
    tokensDetails: TEST_TOKEN_DETAILS
  };
  const gasPrices = {
    fast: utils.bigNumberify('24000000000'),
    cheap: utils.bigNumberify('20000000000'),
  };
  const gasPriceOracle: any = {
    getGasPrices: sinon.stub().resolves(gasPrices)
  };
  const tokenPrices: TokensPrices = {
    ETH: {USD: 1838.51, EUR: 1494.71, BTC: 0.09893},
    Mock: {USD: 0.2391, EUR: 0.1942, BTC: 0.00001427}
  };
  const priceObserver: any = {
    getCurrentPrices: sinon.stub().resolves(tokenPrices)
  };
  const gasModeService = new GasModeService(tokensDetailsStore, gasPriceOracle, priceObserver);

  it('get modes', async () => {
    const modes = await gasModeService.getModes();
    expect(gasPriceOracle.getGasPrices).calledOnce;
    expect(modes).to.be.deep.eq([
      {
        name: 'cheap',
        gasOptions: [{
          gasPrice: gasPrices.cheap,
          token: TEST_TOKEN_DETAILS[0],
        },
        {
          gasPrice: gasPrices.cheap,
          token: TEST_TOKEN_DETAILS[1],
        }]
      },
      {
        name: 'fast',
        gasOptions: [{
          gasPrice: gasPrices.fast,
          token: TEST_TOKEN_DETAILS[0],
        },
        {
          gasPrice: gasPrices.fast,
          token: TEST_TOKEN_DETAILS[1],
        }]
      }
    ]);
  });
});
