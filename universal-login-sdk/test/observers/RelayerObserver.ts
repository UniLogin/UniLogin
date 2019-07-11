import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import RelayerObserver from '../../lib/observers/RelayerObserver';
import { waitUntil } from '@universal-login/commons';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

describe('SDK: RelayerObserver', async () => {
  let relayer: Relayer;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let relayerObserver: RelayerObserver;

  beforeEach(async () => {
    ({sdk, relayer, contractAddress} = await loadFixture(basicSDK));
    ({relayerObserver} = sdk);
    relayerObserver.step = 50;
  });

  it('should not emit events if no connection requests', async () => {
    const callback = sinon.spy();
    const unsubscribe = relayerObserver.subscribeAndStart(contractAddress, callback);
    await relayerObserver.tick();
    unsubscribe();
    expect(callback).to.have.not.been.called;
  });

  it('should emit AuthorisationsChanged event if connected called', async () => {
    const callback = sinon.spy();
    const unsubscribe = relayerObserver.subscribeAndStart(contractAddress, callback);
    await sdk.connect(contractAddress);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();
    expect(callback).to.have.been.called;
  });

  it('AuthorisationChanged for multiple identities', async () => {
    const [, newContractAddress] = await sdk.create('newlogin.mylogin.eth');
    const callback = sinon.spy();

    let unsubscribe = relayerObserver.subscribeAndStart(contractAddress, callback);
    await sdk.connect(contractAddress);
    await waitUntil(() => !!callback.firstCall);
    unsubscribe();

    unsubscribe = await relayerObserver.subscribeAndStart(contractAddress, callback);
    await sdk.connect(newContractAddress);
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();
    expect(callback).to.have.been.calledTwice;
  });

  after(async () => {
    await relayer.stop();
  });
});
