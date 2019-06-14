import {expect} from 'chai';
import sinon from 'sinon';
import {retry} from '../../lib/utils/retry';

describe('Retry function', async () => {
  let result: boolean;
  const callback = sinon.spy(async () => result);
  const setResultTrue = () => {
    result = true;
  };
  const retryWhile = (result: any) => !result;

  beforeEach(() => {
    result = false;
  });

  it('Should return true', async () => {
    setTimeout(setResultTrue, 10);
    const returnedResult = await retry(callback, retryWhile, 1000, 2);
    expect(returnedResult).to.be.true;
    expect(callback.callCount).at.least(3);
  });

  it('throw Timeout', async () => {
    await expect(retry(callback, retryWhile, 5, 2)).to.be.eventually.rejectedWith('Timeout');
  });
});
