import {expect} from 'chai';
import sinon from 'sinon';
import {GasPriceOracle} from '../../../lib/integration/http/gasPriceOracle';
import {utils} from 'ethers';


describe('UNIT: GasPriceOracle', () => {
  const testGasPrices = [
    {basicGasPrice: utils.bigNumberify('20000000000'), fastExpected: utils.bigNumberify('24000000000')},
    {basicGasPrice: utils.bigNumberify('0'), fastExpected: utils.bigNumberify('0')},
    {basicGasPrice: utils.bigNumberify('12000000001'), fastExpected: utils.bigNumberify('0x035a4e9001')}
  ];
  for (const {basicGasPrice, fastExpected} of testGasPrices) {
    const getGasPrice = sinon.stub().resolves(basicGasPrice);
    const provider = {getGasPrice};

    const gasPriceOracle = new GasPriceOracle(provider as any);

    it(`have properly result for returned basic gas price: ${basicGasPrice}`, async () => {
      expect(await gasPriceOracle.getGasPrices()).to.deep.eq({
        cheap: basicGasPrice,
        fast: fastExpected
      });
    });
  }
});
