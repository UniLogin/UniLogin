import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Wallet} from 'ethers';
import sinon from 'sinon';
import {waitUntil} from '@unilogin/commons';
import {mineBlock} from '@unilogin/contracts/testutils';
import {BlockchainService} from '@unilogin/contracts';
import {BlockNumberState} from '../../../src/core/states/BlockNumberState';

describe('INT: BlockNumberState', () => {
  let provider;
  let wallet: Wallet;
  let state: BlockNumberState;
  let callback: any;

  it('no subscriptions', () => {
    state = new BlockNumberState(new BlockchainService(createMockProvider()));
    expect(state.get()).to.eq(0);
  });

  describe('1 subscription', () => {
    beforeEach(() => {
      provider = createMockProvider();
      [wallet] = getWallets(provider);
      provider.pollingInterval = 1;
      state = new BlockNumberState(new BlockchainService(provider));
      callback = sinon.spy();
    });

    it('no blocks', async () => {
      const unsubscribe = state.subscribe(callback);

      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledOnce;
      expect(state.get()).to.eq(0);

      unsubscribe();
      expect(state.get()).to.eq(0);
    });

    it('1 block', async () => {
      const unsubscribe = state.subscribe(callback);
      mineBlock(wallet);
      await waitUntil(() => !!callback.secondCall);
      expect(state.get()).to.eq(1);

      unsubscribe();
      expect(state.get()).to.eq(1);
    });

    it('2 blocks', async () => {
      const unsubscribe = state.subscribe(callback);
      mineBlock(wallet);

      await waitUntil(() => !!callback.secondCall);
      expect(state.get()).to.eq(1);
      mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      expect(state.get()).to.eq(2);

      unsubscribe();
      expect(state.get()).to.eq(2);
    });
  });

  describe('2 subscriptions', () => {
    beforeEach(() => {
      provider = createMockProvider();
      [wallet] = getWallets(provider);
      provider.pollingInterval = 1;
      state = new BlockNumberState(new BlockchainService(provider));
      callback = sinon.spy();
    });

    it('2 blocks', async () => {
      const callback2 = sinon.spy();
      const unsubscribe1 = state.subscribe(callback);
      const unsubscribe2 = state.subscribe(callback2);
      await waitUntil(() => !!callback.firstCall);
      await waitUntil(() => !!callback2.firstCall);
      expect(state.get()).to.eq(0);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.secondCall);
      await waitUntil(() => !!callback2.secondCall);
      expect(state.get()).to.eq(1);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      await waitUntil(() => !!callback2.thirdCall);
      expect(state.get()).to.eq(2);

      unsubscribe1();
      unsubscribe2();

      expect(state.get()).to.eq(2);
    });
  });
});
