import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import Relayer from '@universal-login/relayer';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../lib/sdk';
import RelayerObserver from '../../lib/observers/RelayerObserver';

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
    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress}, callback);
    await relayerObserver.checkAuthorisationRequests();
    expect(callback).to.have.not.been.called;
  });

  it('should emit AuthorisationsChanged event if connected called', async () => {
    const callback = sinon.spy();
    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress}, callback);
    await sdk.connect(contractAddress);
    await relayerObserver.checkAuthorisationRequests();
    expect(callback).to.have.been.called;
  });

  it('observation: no new reuqests', async () => {
    const callback = sinon.spy();
    relayerObserver.start();
    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress}, callback);
    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.not.been.called;
  });

  it('observation: one new request', async () => {
    const callback = sinon.spy();
    relayerObserver.start();
    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress}, callback);
    await sdk.connect(contractAddress);
    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.been.called;
  });

  it('AuthorisationChanged for multiple identities', async () => {
    const [, newContractAddress] = await sdk.create('newlogin.mylogin.eth');
    const callback = sinon.spy();
    sdk.relayerObserver.start();

    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress}, callback);
    await relayerObserver.subscribe('AuthorisationsChanged', {contractAddress: newContractAddress}, callback);

    await sdk.connect(contractAddress);
    await sdk.connect(newContractAddress);

    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.been.calledTwice;
  });

  after(async () => {
    await relayer.stop();
  });
});
