import {expect} from 'chai';
import {GasDataComputation} from '../../../src/core/utils/messages/computeGasData';

describe('UNIT: GasDataComputation', async () => {
  describe('before Istanbul', () => {
    const gasComputation = new GasDataComputation('constantinople');

    it('0x', async () => {
      const data = '0x';

      expect(gasComputation.computeGasData(data)).to.equal(0);
    });

    it('0xbeef', async () => {
      const data = '0xbeef';

      expect(gasComputation.computeGasData(data)).to.equal(136);
    });

    it('0x00ef', async () => {
      const data = '0x00ef';

      expect(gasComputation.computeGasData(data)).to.equal(72);
    });

    it('long hex', async () => {
      const tenZeroBytes = '00000000000000000000';
      const twentyNonZeroBytes = 'f65bc65a5043e6582b38aa2269bafd759fcdfe32';
      const data = `0x${twentyNonZeroBytes}${tenZeroBytes}`;

      expect(gasComputation.computeGasData(data)).to.equal(1400);
    });

    it('invalid hex', async () => {
      const data = '';

      expect(() => gasComputation.computeGasData(data)).to.throw('Not a valid hex string');
    });

    it('invalid hex layout - odd number of symbols', async () => {
      const data = '0xbee';

      expect(() => gasComputation.computeGasData(data)).to.throw('Not a valid hex string');
    });
  });

  describe('post Istanbul', async () => {
    const gasComputation = new GasDataComputation('istanbul');
    const itComputesCostForData = (data: string, expectedResult: number) =>
      it(`${data} costs ${expectedResult}`, async () => {
        expect(gasComputation.computeGasData(data)).to.equal(expectedResult);
      });

    itComputesCostForData('0x', 0);
    itComputesCostForData('0x00', 4);
    itComputesCostForData('0x11', 16);
    itComputesCostForData('0x1111', 32);
    itComputesCostForData('0xffffffffffffffffff00000000', 160);
  });
});
