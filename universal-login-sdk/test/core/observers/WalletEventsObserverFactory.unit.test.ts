import {TEST_CONTRACT_ADDRESS, TEST_KEY, ProviderService} from '@unilogin/commons';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {keyAddedEvent, keyRemovedEvent} from '../../helpers/constants';
import {waitExpect} from '@unilogin/commons/testutils';
import {NewBlockObserver} from '../../../src/core/observers/NewBlockObserver';

chai.use(sinonChai);

const filter = {
  contractAddress: TEST_CONTRACT_ADDRESS,
  key: TEST_KEY,
};

describe('UNIT: WalletEventsObserverFactory', () => {
  let onKeyAdd: sinon.SinonSpy;
  let onKeyRemove: sinon.SinonSpy;
  let factory: WalletEventsObserverFactory;
  let providerService: ProviderService;
  let newBlockObserver: NewBlockObserver;

  beforeEach(async () => {
    providerService = {
      getBlockNumber: sinon.fake.resolves(1),
    } as any;
    newBlockObserver = {
      subscribe: sinon.fake.returns(() => {}),
      callCallbacks: () => {},
    } as any;

    factory = new WalletEventsObserverFactory(providerService, newBlockObserver);
    onKeyAdd = sinon.spy();
    onKeyRemove = sinon.spy();
    await factory.start();
  });

  afterEach(() => {
    factory.stop();
  });

  describe('fetchEventsOfType', () => {
    it('KeyAdded', async () => {
      providerService.getLogs = sinon.fake.resolves([keyAddedEvent]);
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      await factory.fetchEventsOfTypes(['KeyAdded'], 2);
      expect(onKeyAdd).to.have.been.calledOnce;
    });

    it('KeyRemoved', async () => {
      providerService.getLogs = sinon.fake.resolves([keyRemovedEvent]);
      factory.subscribe('KeyRemoved', filter, onKeyRemove);
      await factory.fetchEventsOfTypes(['KeyRemoved'], 2);
      expect(onKeyRemove).to.have.been.calledOnce;
    });

    it('does not called if factory started but does not have subscriptions', async () => {
      const spy = sinon.spy(factory, 'fetchEventsOfTypes');
      await factory.fetchEvents(1);
      expect(spy).to.not.have.been.called;
    });

    it('called if factory started but does not have subscriptions', async () => {
      const spy = sinon.spy(factory, 'fetchEventsOfTypes');
      await factory.fetchEvents(1);
      expect(spy).to.not.have.been.calledOnce;
    });
  });

  describe('subscribe', () => {
    let onKeyAdd2: sinon.SinonSpy;

    beforeEach(() => {
      onKeyAdd2 = sinon.spy();
      providerService.getLogs = async (filter) => filter.topics?.includes('0x654abba5d3170185ed25c9b41f7d2094db3643986b05e9e9cab37028b800ad7e') ? [keyAddedEvent] : [];
    });

    it('fetch after subscribe', () => {
      const spy = sinon.spy(factory, 'fetchEvents');
      newBlockObserver.callCallbacks = () => factory.fetchEvents(1);
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      expect(spy).calledOnceWith(1);
    });

    it('subscribe twice', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      factory.subscribe('KeyAdded', filter, onKeyAdd2);
      factory.fetchEvents(2);
      await waitExpect(() => expect(onKeyAdd).to.have.been.calledOnce);
      expect(onKeyAdd).to.have.been.calledOnceWith({key: TEST_KEY});
      expect(onKeyAdd2).to.have.been.calledOnceWith({key: TEST_KEY});
    });

    it('subscribe twice with 1 unsubscribe', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      factory.fetchEvents(1);
      await waitExpect(() => expect(onKeyAdd).to.have.been.calledOnce);
      expect(onKeyAdd).to.have.been.calledOnceWith({key: TEST_KEY});
      expect(onKeyAdd2).to.not.have.been.called;
    });

    it('callbacks does not called if unsubscribes called ', () => {
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe2 = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      unsubscribe2();
      factory.fetchEvents(1);
      expect(onKeyAdd).to.not.have.been.called;
      expect(onKeyAdd2).to.not.have.been.called;
    });
  });
});
