import chai, {expect} from 'chai';
import {sleep} from '../../lib/utils/wait';
import {debounce} from '../../lib/utils/debounce';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('debounce', () => {
  const tick = 10;
  it('works for one callback at one time', async () => {
    const callback = sinon.spy();
    const debounceCallback = debounce(callback, 0);
    debounceCallback();
    await sleep(0);
    expect(callback).to.have.been.calledOnce;
  });

  it('works for a lot of callbacks', async () => {
    const callback = sinon.spy();
    const debounceCallback = debounce(callback, tick);
    debounceCallback();
    debounceCallback();
    debounceCallback();
    debounceCallback();
    debounceCallback();
    debounceCallback();
    await sleep(tick);
    expect(callback).to.have.been.calledOnce;
  });

  it('works with args', async () => {
    const callback = sinon.spy();
    const args = 'some args';
    const debounceCallback = debounce(callback, tick);
    debounceCallback(args);
    await sleep(tick);
    expect(callback).to.have.been.calledWith(args);
  });

  it('works with a lot of args', async () => {
    const callback = sinon.spy();
    let args = 0;
    const debounceCallback = debounce(callback, tick);
    debounceCallback(args);
    args++;
    debounceCallback(args);
    args++;
    debounceCallback(args);
    args++;
    debounceCallback(args);
    args++;
    debounceCallback(args);
    args++;
    debounceCallback(args);
    args++;
    debounceCallback(args);
    await sleep(tick);
    expect(callback).to.have.been.calledWith(args);
  });
});
