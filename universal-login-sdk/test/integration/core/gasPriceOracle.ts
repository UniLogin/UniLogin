import {expect} from 'chai';
import {GasPriceOracle, GasPriceOption} from '../../../lib/integration/http/gasPriceOracle';

const response = {
  fast: 100,
  fastest: 150,
  average: 50
};

describe('INT: GasPriceOracle', () => {
  let gasPrices: Record<GasPriceOption, number>;
  const gasPriceOracle = new GasPriceOracle();
  (gasPriceOracle as any).http = async (verb: string, url: string) => Promise.resolve(response);

  beforeEach(async () => {
    gasPrices = await gasPriceOracle.getGasPrices();
  });

  it('have exactly {fastest | fast | average} props', async () => {
    expect(gasPrices).to.have.property('fastest');
    expect(gasPrices).to.have.property('fast');
    expect(gasPrices).to.have.property('average');

    expect(Object.keys(gasPrices).length).to.be.equal(3);
  });

  it('props are monotonic', async () => {
    expect(gasPrices.fastest).to.be.greaterThan(gasPrices.fast);
    expect(gasPrices.fast).to.be.greaterThan(gasPrices.average);
  });
});
