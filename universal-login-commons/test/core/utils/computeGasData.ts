import {expect} from 'chai';
import {computeGasData, NON_ZERO_BYTE_GAS_COST, ZERO_BYTE_GAS_COST} from '../../../lib/core/utils/messages/computeGasData';

describe('UNIT: computeGasData', async () => {
  it('0x', async () => {
    const data = '0x';

    expect(computeGasData(data)).to.equal(0);
  });

  it('0xbeef', async () => {
    const data = '0xbeef';

    expect(computeGasData(data)).to.equal(136);
  });

  it('0x00ef', async () => {
    const data = '0x00ef';

    expect(computeGasData(data)).to.equal(72);
  });

  it('long hex', async () => {
    const tenZeroBytes = '00000000000000000000';
    const twentyNonZeroBytes = 'f65bc65a5043e6582b38aa2269bafd759fcdfe32';
    const data = `0x${twentyNonZeroBytes}${tenZeroBytes}`;

    expect(computeGasData(data)).to.equal(1400);
  });

  it('invalid hex', async () => {
    const data = ``;

    expect(() => computeGasData(data)).to.throw('Not a valid hex string');
  });

  it('invalid hex layout - odd number of symbols', async () => {
    const data = `0xbee`;

    expect(() => computeGasData(data)).to.throw('Not a valid hex string');
  });
});
