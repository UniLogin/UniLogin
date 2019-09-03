import {expect} from 'chai';
import {GasPriceOracle, GasPriceSuggestion} from '../../../lib/integration/http/gasPriceOracle';
import {utils} from 'ethers';

const mockedResponse = {
  fast: 100,
  fastest: 150,
  safeLow: 20,
  average: 50,
  block_time: 11.75,
  blockNum: 8475816,
  speed: 0.9857656544502541,
  safeLowWait: 17.6,
  avgWait: 5.2,
  fastWait: 0.8,
  fastestWait: 0.4,
};

describe('UNIT: GasPriceOracle', () => {
  let gasPrices: GasPriceSuggestion;
  const gasPriceOracle = new GasPriceOracle();
  (gasPriceOracle as any).http = async (verb: string, url: string) => Promise.resolve(mockedResponse);

  beforeEach(async () => {
    gasPrices = await gasPriceOracle.getGasPrices();
  });

  it('have exactly {fastest | fast | average} props', async () => {
    expect(gasPrices.fastest).to.deep.eq(utils.bigNumberify('15000000000'));
    expect(gasPrices.fast).to.eq(utils.bigNumberify('10000000000'));
    expect(gasPrices.average).to.eq(utils.bigNumberify('5000000000'));

    expect(Object.keys(gasPrices).length).to.be.equal(3);
  });
});
