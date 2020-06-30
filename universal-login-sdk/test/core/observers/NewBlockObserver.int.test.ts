import {expect} from 'chai';
import sinon from 'sinon';
import {MockProvider} from 'ethereum-waffle';
import {ProviderService} from '@unilogin/commons';
import {mineBlock, waitExpect} from '@unilogin/commons/testutils';
import {NewBlockObserver} from '../../../src/core/observers/NewBlockObserver';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';

describe('INT: NewBlockObserver', () => {
  let newBlockObserver: NewBlockObserver;
  let blockNumberState: BlockNumberState;
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();

  beforeEach(async () => {
    provider.pollingInterval = 10;
    const providerService = new ProviderService(provider);
    blockNumberState = new BlockNumberState(providerService);
    newBlockObserver = new NewBlockObserver(providerService, blockNumberState);
  });

  it('call callback initially', async () => {
    await mineBlock(wallet);
    await newBlockObserver.start();
    expect(blockNumberState.get()).eq(await provider.getBlockNumber());
    newBlockObserver.stop();
  });

  describe('', () => {
    it('callCallbacks', async () => {
      const callCallbacksSpy = sinon.spy(newBlockObserver, 'callCallbacks');
      const unsubscribe = await newBlockObserver.subscribe(() => {});
      await waitExpect(() => expect(callCallbacksSpy).calledOnce);
      await mineBlock(wallet);
      await waitExpect(() => expect(callCallbacksSpy).calledTwice);
      unsubscribe();
    });

    it('1 callback', async () => {
      const callback = sinon.spy();
      const unsubscribe = await newBlockObserver.subscribe(callback);
      expect(callback).calledOnce;
      await mineBlock(wallet);
      await waitExpect(() => expect(callback).calledTwice);

      unsubscribe();
      await mineBlock(wallet);
      expect(callback).calledTwice;
    });

    it('Multiple callbacks', async () => {
      const callback = sinon.spy();
      const callback2 = sinon.spy();

      const unsubscribe = await newBlockObserver.subscribe(callback);
      const unsubscribe2 = await newBlockObserver.subscribe(callback2);
      expect(callback).calledOnce;
      expect(callback2).calledOnce;

      await mineBlock(wallet);
      await waitExpect(() => expect(callback).calledTwice);
      expect(callback2).calledTwice;

      unsubscribe();
      await mineBlock(wallet);
      await waitExpect(() => expect(callback2).calledThrice);
      expect(callback).calledTwice;

      unsubscribe2();
      await mineBlock(wallet);
      await waitExpect(() => expect(callback2).calledThrice);
      expect(callback).calledTwice;
    });
  });
});
