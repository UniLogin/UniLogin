import {expect} from 'chai';
import sinon from 'sinon';
import {createFixtureLoader} from 'ethereum-waffle';
import {waitUntil} from '@unilogin/commons';
import UniLoginSdk from '../../../src/api/sdk';
import basicSDK from '../../fixtures/basicSDK';
import {Erc721TokensObserver} from '../../../src/core/observers/Erc721TokensObserver';
import {RelayerUnderTest} from '@unilogin/relayer';

const loadFixture = createFixtureLoader();

describe('UNIT: Erc721TokensObserver', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let contractAddress: string;

  beforeEach(async () => {
    ({sdk, relayer, contractAddress} = await loadFixture(basicSDK));
    const erc721TokensService = {
      getTokensForAddress: () => [],
      getTokensDetails: () => [],
    } as any;
    sdk.erc721TokensObserver = new Erc721TokensObserver('0x0', erc721TokensService, 100);
  });

  it('1 subscription', async () => {
    const callback = sinon.spy();

    const unsubscribe = await sdk.subscribeToErc721Tokens(contractAddress, callback);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();

    expect(callback).to.have.been.calledOnce;
  });

  after(async () => {
    await relayer.stop();
  });
});
