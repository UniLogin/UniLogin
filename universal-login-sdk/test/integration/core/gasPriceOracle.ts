import {expect} from 'chai';
import {getGasPrices, GasPriceOption} from '../../../lib/integration/http/gasPriceOracle';

describe('INT: GasPriceOracle', () => {
  let gasPrices: Record<GasPriceOption, number>;

  beforeEach(async () => {
    gasPrices = await getGasPrices();
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
