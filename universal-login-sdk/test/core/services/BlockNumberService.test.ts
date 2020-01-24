import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';
import {BlockNumberService} from '../../../src/core/services/BlockNumberService';
import {StorageEntry} from '../../../src';

chai.use(sinonChai);

describe('UNIT: BlockNumberService', () => {
  const sandbox = sinon.createSandbox();
  const callback = sandbox.spy();

  const blockNumberStateStub = sandbox.createStubInstance(BlockNumberState);

  const blockNumberStorageStub = sandbox.createStubInstance(StorageEntry);

  const blockNumberService = new BlockNumberService(blockNumberStateStub as any, blockNumberStorageStub);

  beforeEach(() => {
    blockNumberStateStub.get.returns(0);
    blockNumberStorageStub.get.returns(10);
  });

  afterEach(() => {
    sandbox.resetHistory();
  });

  describe('get', () => {
    it('storage has saved value', () => {
      const initialBlockNumber = blockNumberService.get();
      expect(initialBlockNumber).to.eq(10);
      expect(blockNumberStateStub.get).to.not.be.called;
      expect(blockNumberStorageStub.get).to.be.calledOnceWith('LAST_BLOCK_NUMBER');
    });

    it('storage does not have saved value', () => {
      blockNumberStorageStub.get.returns(null);
      const initialBlockNumber = blockNumberService.get();
      expect(initialBlockNumber).to.eq(0);
      expect(blockNumberStateStub.get).to.be.calledOnce;
      expect(blockNumberStorageStub.get).to.be.calledOnce;
    });
  });


  it('subscribe', async () => {
    blockNumberService.subscribe(callback);
    expect(blockNumberStateStub.subscribe).to.be.calledOnceWith(callback);
  });

  it('set', async () => {
    blockNumberService.set(100);
    expect(blockNumberStateStub.set).to.be.calledOnceWithExactly(100);
    expect(blockNumberStorageStub.set).to.be.calledOnceWithExactly('LAST_BLOCK_NUMBER', '100');
    expect(blockNumberStorageStub.set).to.be.calledImmediatelyBefore(blockNumberStateStub.set);
  });
});
