import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';
import {BlockNumberService} from '../../../src/core/services/BlockNumberService';

chai.use(sinonChai);

describe('UNIT: BlockNumberService', () => {
  const sandbox = sinon.createSandbox();
  const callback = sandbox.spy();

  const blockNumberStateStub = sandbox.createStubInstance(BlockNumberState);
  blockNumberStateStub.get.returns(0);

  const blockNumberService = new BlockNumberService(blockNumberStateStub as any);

  afterEach(() => {
    sandbox.resetHistory();
  });

  it('get', () => {
    const initialBlockNumber = blockNumberService.get();
    expect(initialBlockNumber).to.eq(0);
    expect(blockNumberStateStub.get).to.be.calledOnce;
  });

  it('subscribe', async () => {
    blockNumberService.subscribe(callback);
    expect(blockNumberStateStub.subscribe).to.be.calledOnceWith(callback);
  });

  it('set', async () => {
    blockNumberService.set(10);
    expect(blockNumberStateStub.set).to.be.calledOnceWithExactly(10);
  });
});
