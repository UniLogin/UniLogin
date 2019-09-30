import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {TokensPrices, TEST_TOKEN_DETAILS} from '@universal-login/commons';
import {GasModeService} from '../../../lib/core/services/GasModeService';
import {utils} from 'ethers';

chai.use(sinonChai);

describe('UNIT: GasModeService', () => {
  const tokensDetailsStore: any = {tokensDetails: TEST_TOKEN_DETAILS};

  const gasPrices = {
    fast: utils.bigNumberify('24000000000'),
    cheap: utils.bigNumberify('20000000000'),
  };
  const gasPriceOracle: any = {getGasPrices: sinon.stub().resolves(gasPrices)};

  const tokenPrices: TokensPrices = {
    ETH: {USD: 1838.51, DAI: 1494.71, ETH: 1},
    DAI: {USD: 0.2391, DAI: 0.1942, ETH: 0.00001427}
  };
  const priceObserver: any = {
    getCurrentPrices: sinon.stub().resolves(tokenPrices)
  };

  const gasModeService = new GasModeService(tokensDetailsStore, gasPriceOracle, priceObserver);

  const getCurrencyAmountSpy = sinon.spy((gasModeService as any).getCurrencyAmount);
  (gasModeService as any).getCurrencyAmount = getCurrencyAmountSpy;

  it('get modes', async () => {
    const modes = await gasModeService.getModes();
    expect(gasPriceOracle.getGasPrices).calledOnce;

    expect(getCurrencyAmountSpy.getCall(0)).calledWith(gasPrices.cheap, 'USD');
    expect(getCurrencyAmountSpy.getCall(1)).calledWith(gasPrices.cheap, 'DAI');
    expect(getCurrencyAmountSpy.getCall(2)).calledWith(gasPrices.cheap, 'ETH');
    expect(getCurrencyAmountSpy.getCall(3)).calledWith(gasPrices.fast, 'USD');
    expect(getCurrencyAmountSpy.getCall(4)).calledWith(gasPrices.fast, 'DAI');
    expect(getCurrencyAmountSpy.getCall(5)).calledWith(gasPrices.fast, 'ETH');
    expect(getCurrencyAmountSpy.callCount).to.eq(6);

    expect(modes).to.be.deep.eq([
      {
        name: 'cheap',
        usdAmount: '0.0000367702',
        gasOptions: [{
          gasPrice: utils.bigNumberify('29894200000000'),
          token: TEST_TOKEN_DETAILS[0],
        },
        {
          gasPrice: gasPrices.cheap,
          token: TEST_TOKEN_DETAILS[1],
        }]
      },
      {
        name: 'fast',
        usdAmount: '0.00004412424',
        gasOptions: [{
          gasPrice: utils.bigNumberify('35873040000000'),
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
