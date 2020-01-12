import {TEST_CONTRACT_ADDRESS, TEST_KEY} from '@universal-login/commons';
import {BlockchainService} from '@universal-login/contracts';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {keyAddedEvent, keyRemovedEvent} from '../../helpers/constants';

chai.use(sinonChai);

const filter = {
  contractAddress: TEST_CONTRACT_ADDRESS,
  key: TEST_KEY,
};

describe('UNIT: WalletEventsObserverFactory', async () => {
  let onKeyAdd: ReturnType<typeof sinon.spy>;
  let onKeyRemove: ReturnType<typeof sinon.spy>;
  let factory: WalletEventsObserverFactory;
  let blockchainService: BlockchainService;

  beforeEach(async () => {
    blockchainService = {} as any;
    factory = new WalletEventsObserverFactory(blockchainService);
    onKeyAdd = sinon.spy();
    onKeyRemove = sinon.spy();
  });

  describe('fetchEventsOfType', () => {
    it('KeyAdded', async () => {
      blockchainService.getLogs = sinon.fake.returns([keyAddedEvent]);
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      await factory.fetchEventsOfType(['KeyAdded']);
      expect(onKeyAdd).to.have.been.calledOnce;
    });

    it('KeyRemoved', async () => {
      blockchainService.getLogs = sinon.fake.returns([keyRemovedEvent]);
      factory.subscribe('KeyRemoved', filter, onKeyRemove);
      await factory.fetchEventsOfType(['KeyRemoved']);
      expect(onKeyRemove).to.have.been.calledOnce;
    });
  });

  describe('subscribe', () => {
    let onKeyAdd2: ReturnType<typeof sinon.spy>;

    beforeEach(() => {
      onKeyAdd2 = sinon.spy();
      blockchainService.getLogs = sinon.fake.returns([keyAddedEvent]);
    });

    it('subscribe twice', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      factory.subscribe('KeyAdded', filter, onKeyAdd2);
      await factory.fetchEventsOfType(['KeyAdded']);
      expect(onKeyAdd).to.have.been.calledOnce;
      expect(onKeyAdd2).to.have.been.calledOnce;
    });

    it('subscribe twice with 1 unsubscribe', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      await factory.fetchEventsOfType(['KeyAdded']);
      expect(onKeyAdd).to.have.been.calledOnce;
      expect(onKeyAdd2).to.not.have.been.called;
    });

    it('subscribe twice with 2 unsubscribes', async () => {
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe2 = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      unsubscribe2();
      await factory.fetchEventsOfType(['KeyAdded']);
      expect(onKeyAdd).to.not.have.been.called;
      expect(onKeyAdd2).to.not.have.been.called;
    });
  });
});
