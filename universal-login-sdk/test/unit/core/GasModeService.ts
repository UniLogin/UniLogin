import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {utils} from 'ethers';
import {convertTenthGweiToWei, TokensPrices} from '@universal-login/commons';
import {GasModeService} from '../../../lib/core/services/GasModeService';

chai.use(sinonChai);

describe('UNIT: GasModeService', () => {
  const tokensDetails = [{
    address: '0xA193E42526F1FEA8C99AF609dcEabf30C1c29fAA',
    symbol: 'Mock',
    name: 'MockToken'
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'ether'
  }];
  const tokensDetailsStore: any = {
    tokensDetails
  };
  const gasPrices = {
    fast: {
      price: convertTenthGweiToWei(100),
      timeWait: '0.8'
    },
    cheap: {
      price: convertTenthGweiToWei(50),
      timeWait: '1.2'
    }
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
        name: 'Cheap',
        gasOptions: [{
          gasPrice: gasPrices.cheap.price,
          token: tokensDetails[0],
        },
        {
          gasPrice: gasPrices.cheap.price,
          token: tokensDetails[1],
        }]
      },
      {
        name: 'Fast',
        gasOptions: [{
          gasPrice: gasPrices.fast.price,
          token: tokensDetails[0],
        },
        {
          gasPrice: gasPrices.fast.price,
          token: tokensDetails[1],
        }]
      }
    ]);
  });
});
