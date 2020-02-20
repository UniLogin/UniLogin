import {expect} from 'chai';
import sinon from 'sinon';
import {retry} from '../../../src/core/utils/retry';

describe('UNIT: Retry function', () => {
  const callback = sinon.stub();
  const retryWhile = (result: any) => !result;

  beforeEach(() => {
    callback.reset();
    callback.resolves(false);
  });

  it('Should return true', async () => {
    callback.onCall(3).resolves(true);
    const returnedResult = await retry(callback, retryWhile, 1000, 2);
    expect(returnedResult).to.be.true;
    expect(callback.callCount).eq(4);
  });

  it('throw Timeout', async () => {
    await expect(retry(callback, retryWhile, 5, 2)).to.be.eventually.rejectedWith('Timeout exceeded');
  });
});
