import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Wallet} from 'ethers';
import sinon from 'sinon';
import {waitUntil} from '@universal-login/commons';
import {mineBlock} from '@universal-login/contracts/testutils';
import {BlockchainService} from '@universal-login/contracts';
import {BlockProperty} from '../../../src/core/properties/BlockProperty';

describe('INT: BlockProperty', () => {
  let provider;
  let wallet: Wallet;
  let property: BlockProperty;
  let callback: any;

  it('no subscriptions', () => {
    property = new BlockProperty(createMockProvider());
    expect(property.get()).to.eq(0);
  });

  describe('1 subscription', () => {
    beforeEach(() => {
      provider = createMockProvider();
      [wallet] = getWallets(provider);
      provider.pollingInterval = 1;
      property = new BlockProperty(provider);
      callback = sinon.spy();
    });

    it('no blocks', async () => {
      const unsubscribe = property.subscribe(callback);

      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledOnce;
      expect(property.get()).to.eq(0);

      unsubscribe();
      expect(property.get()).to.eq(0);
    });

    it('1 block', async () => {
      const unsubscribe = property.subscribe(callback);
      mineBlock(wallet);
      await waitUntil(() => !!callback.secondCall);
      expect(property.get()).to.eq(1);

      unsubscribe();
      expect(property.get()).to.eq(1);
    });

    it('2 blocks', async () => {
      const unsubscribe = property.subscribe(callback);
      mineBlock(wallet);

      await waitUntil(() => !!callback.secondCall);
      expect(property.get()).to.eq(1);
      mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      expect(property.get()).to.eq(2);

      unsubscribe();
      expect(property.get()).to.eq(2);
    });
  });

  describe('2 subscriptions', () => {
    beforeEach(() => {
      provider = createMockProvider();
      [wallet] = getWallets(provider);
      provider.pollingInterval = 1;
      property = new BlockProperty(provider);
      callback = sinon.spy();
    });

    it('2 blocks', async () => {
      const callback2 = sinon.spy();
      const unsubscribe1 = property.subscribe(callback);
      const unsubscribe2 = property.subscribe(callback2);
      await waitUntil(() => !!callback.firstCall);
      await waitUntil(() => !!callback2.firstCall);
      expect(property.get()).to.eq(0);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.secondCall);
      await waitUntil(() => !!callback2.secondCall);
      expect(property.get()).to.eq(1);

      await mineBlock(wallet);
      await waitUntil(() => !!callback.thirdCall);
      await waitUntil(() => !!callback2.thirdCall);
      expect(property.get()).to.eq(2);

      unsubscribe1();
      unsubscribe2();

      expect(property.get()).to.eq(2);
    });
  });
});
