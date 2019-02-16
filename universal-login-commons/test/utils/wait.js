import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {waitUntil} from '../../lib/utils/wait';

chai.use(chaiAsPromised);

describe('waitUntil', async () => {
  it('should return true, if function returns true', async () => {
    const func = () => true;
    expect(await waitUntil(func)).to.be.true;
  });

  it('should throw error, if timeout', async () => {
    const func = () => false;
    await expect(waitUntil(func, 1, 10)).to.be.eventually.rejectedWith('Timeout');
  });

  it('should return true, if iteration', async () => {
    let count = 0;
    const func = () => {
      count++;
      return count === 3;
    };
    expect(await waitUntil(func, 1)).to.be.true;
    expect(count).to.eq(3);
  });

  it('should return true with arguments', async () => {
    const func = (args) => args === true;
    expect(await waitUntil(func, 1, 10, [true])).to.be.true;
    await expect(waitUntil(func, 1, 10)).to.be.eventually.rejectedWith('Timeout');
  });
});
