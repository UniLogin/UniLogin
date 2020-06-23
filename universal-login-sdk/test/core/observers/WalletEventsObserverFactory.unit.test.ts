import {TEST_CONTRACT_ADDRESS, TEST_KEY, ProviderService} from '@unilogin/commons';
import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import WalletEventsObserverFactory from '../../../src/core/observers/WalletEventsObserverFactory';
import {keyAddedEvent, keyRemovedEvent} from '../../helpers/constants';
import {waitExpect} from '@unilogin/commons/testutils';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';
import {IStorageService} from '../../../src';

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
  let blockNumberState: BlockNumberState;
  let storageService: IStorageService;

  beforeEach(async () => {
    providerService = {
      getBlockNumber: sinon.fake.resolves(1),
    } as any;
    blockNumberState = {
      get: sinon.fake.returns(1),
      set: sinon.fake(),
      subscribe: sinon.fake.returns(() => {}),
    } as any;
    storageService = {
      get: sinon.fake.returns(1),
      set: sinon.fake(),
    } as any;

    factory = new WalletEventsObserverFactory(providerService, blockNumberState, storageService);
    onKeyAdd = sinon.spy();
    onKeyRemove = sinon.spy();
    await factory.start();
  });

  afterEach(() => {
    factory.stop();
  });

  describe('fetchEventsOfType', () => {
    describe('KeyAdded', () => {
      it('callback is called', async () => {
        providerService.getLogs = sinon.fake.resolves([keyAddedEvent]);
        factory.subscribe('KeyAdded', filter, onKeyAdd);
        sinon.replace(blockNumberState, 'get', sinon.fake.returns(2));
        await factory.fetchEventsOfTypes(['KeyAdded']);
        expect(onKeyAdd).to.have.been.calledOnce;
      });

      it('callback does not called', async () => {
        providerService.getLogs = sinon.fake.resolves([keyAddedEvent]);
        factory.subscribe('KeyAdded', filter, onKeyAdd);
        await factory.fetchEventsOfTypes(['KeyAdded']);
        expect(onKeyAdd).to.not.have.been.called;
      });
    });

    describe('KeyRemoved', () => {
      it('callback is called', async () => {
        providerService.getLogs = sinon.fake.resolves([keyRemovedEvent]);
        factory.subscribe('KeyRemoved', filter, onKeyRemove);
        sinon.replace(blockNumberState, 'get', sinon.fake.returns(2));
        await factory.fetchEventsOfTypes(['KeyRemoved']);
        expect(onKeyRemove).to.have.been.calledOnce;
      });

      it('callback does not called', async () => {
        providerService.getLogs = sinon.fake.resolves([keyRemovedEvent]);
        factory.subscribe('KeyRemoved', filter, onKeyRemove);
        await factory.fetchEventsOfTypes(['KeyRemoved']);
        expect(onKeyRemove).to.not.have.been.called;
      });
    });

    it('does not called if factory started but does not have subscriptions', async () => {
      const spy = sinon.spy(factory, 'fetchEventsOfTypes');
      await factory.fetchEvents();
      expect(spy).to.not.have.been.called;
    });

    it('called if factory started but does not have subscriptions', async () => {
      const spy = sinon.spy(factory, 'fetchEventsOfTypes');
      await factory.fetchEvents();
      expect(spy).to.not.have.been.calledTwice;
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
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      expect(spy).calledOnce;
    });

    it('subscribe twice', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      factory.subscribe('KeyAdded', filter, onKeyAdd2);
      sinon.replace(blockNumberState, 'get', sinon.fake.returns(2));
      factory.fetchEvents();
      await waitExpect(() => expect(onKeyAdd).to.have.been.calledOnce);
      expect(onKeyAdd).to.have.been.calledOnceWith({key: TEST_KEY});
      expect(onKeyAdd2).to.have.been.calledOnceWith({key: TEST_KEY});
    });

    it('subscribe twice with 1 unsubscribe', async () => {
      factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      sinon.replace(blockNumberState, 'get', sinon.fake.returns(2));
      factory.fetchEvents();
      await waitExpect(() => expect(onKeyAdd).to.have.been.calledOnce);
      expect(onKeyAdd).to.have.been.calledOnceWith({key: TEST_KEY});
      expect(onKeyAdd2).to.not.have.been.called;
    });

    it('callbacks does not called if unsubscribes called ', () => {
      const unsubscribe = factory.subscribe('KeyAdded', filter, onKeyAdd);
      const unsubscribe2 = factory.subscribe('KeyAdded', filter, onKeyAdd2);
      unsubscribe();
      unsubscribe2();
      sinon.replace(blockNumberState, 'get', sinon.fake.returns(2));
      factory.fetchEvents();
      expect(onKeyAdd).to.not.have.been.called;
      expect(onKeyAdd2).to.not.have.been.called;
    });
  });
});
