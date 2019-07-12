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
    const unsubscribe = relayerObserver.subscribe(contractAddress, callback);
    unsubscribe();
    expect(callback).to.have.been.calledWith([]);
  });

  it('should emit AuthorisationsChanged event if connected called', async () => {
    const callback = sinon.spy();
    const unsubscribe = relayerObserver.subscribe(contractAddress, callback);
    expect(callback).to.have.been.calledWith([]);
    await sdk.connect(contractAddress);
    await waitUntil(() => !!callback.secondCall);
    unsubscribe();
    expect(callback).to.have.been.calledTwice;
  });

  it('AuthorisationChanged for multiple identities', async () => {
    const [, newContractAddress] = await sdk.create('newlogin.mylogin.eth');
    const callback1 = sinon.spy();
    const callback2 = sinon.spy();

    const unsubscribe1 = relayerObserver.subscribe(contractAddress, callback1);
    const unsubscribe2 = await relayerObserver.subscribe(contractAddress, callback2);

    await sdk.connect(contractAddress);
    await sdk.connect(newContractAddress);

    unsubscribe1();
    unsubscribe2();

    await waitUntil(() => !!callback1.secondCall);
    await waitUntil(() => !!callback2.secondCall);

    expect(callback1).to.have.been.calledTwice;
    expect(callback2).to.have.been.calledTwice;
  });

  after(async () => {
    await relayer.stop();
  });
});
