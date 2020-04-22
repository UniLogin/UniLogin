import {expect} from 'chai';
import sinon from 'sinon';
import {GasPriceOracle} from '../../../src/integration/ethereum/gasPriceOracle';
import {utils, ethers} from 'ethers';

describe('UNIT: GasPriceOracle', () => {
  const estimateGasPrices = sinon.stub();
  let gasPriceOracle: GasPriceOracle;

  beforeEach(() => {
    gasPriceOracle = new GasPriceOracle();
    sinon.replace(gasPriceOracle as any, 'fetchGasPrices', estimateGasPrices);
  });

  afterEach(() => {
    estimateGasPrices.reset();
  });

  it('have properly result for returned average: 0,  fast: 0', async () => {
    const gasPriceEstimate = {average: 0, fast: 0, avgWait: 0, fastWait: 0};
    estimateGasPrices.resolves(gasPriceEstimate);
    expect(await gasPriceOracle.getGasPrices()).to.deep.eq({
      cheap: {
        gasPrice: ethers.constants.Zero,
        timeEstimation: 0,
      },
      fast: {
        gasPrice: ethers.constants.Zero,
        timeEstimation: 0,
      },
    });
  });

  it('have properly result for returned average: 1.2,  fast: 2.4', async () => {
    const gasPriceEstimate = {average: 1.2, fast: 2.4, avgWait: 2.2, fastWait: 0.2};
    estimateGasPrices.resolves(gasPriceEstimate);
    expect(await gasPriceOracle.getGasPrices()).to.deep.eq({
      cheap: {
        gasPrice: utils.parseUnits('0.12', 'gwei'),
        timeEstimation: 132,
      },
      fast: {
        gasPrice: utils.parseUnits('0.24', 'gwei'),
        timeEstimation: 12,
      },
    });
  });

  it('have properly result for returned average: 20,  fast: 24', async () => {
    const gasPriceEstimate = {average: 20, fast: 24, avgWait: 1.9, fastWait: 0.5};
    estimateGasPrices.resolves(gasPriceEstimate);
    expect(await gasPriceOracle.getGasPrices()).to.deep.eq({
      cheap: {
        gasPrice: utils.parseUnits('2', 'gwei'),
        timeEstimation: 114,
      },
      fast: {
        gasPrice: utils.parseUnits('2.4', 'gwei'),
        timeEstimation: 30,
      },
    });
  });
});
