import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../../lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, solidity} from 'ethereum-waffle';
import ethers from 'ethers';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK: RelayerObserver', async () => {
  let provider;
  let relayer;
  let sdk;
  let identityAddress;
  let relayerObserver;

  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
    ({relayerObserver} = sdk);
    relayerObserver.step = 50;
    [, identityAddress] = await sdk.create('alex.mylogin.eth');
  });

  it('should not emit events if no connection requests', async () => {
    const callback = sinon.spy();
    await relayerObserver.subscribe('AuthorisationsChanged', identityAddress, callback);
    await relayerObserver.checkAuthorisationRequests();
    expect(callback).to.have.not.been.called;
  });

  it('should emit AuthorisationsChanged event if connected called', async () => {
    const callback = sinon.spy();
    await relayerObserver.subscribe('AuthorisationsChanged', identityAddress, callback);
    const privateKey = await sdk.connect(identityAddress, 'Some label');
    const {address} = new ethers.Wallet(privateKey);
    await relayerObserver.checkAuthorisationRequests();
    expect(callback).to.have.been.calledWith(sinon.match([{index: 0, key: address, label: 'Some label'}]));
  });

  it('observation: no new reuqests', async () => {
    const callback = sinon.spy();
    relayerObserver.start();
    await relayerObserver.subscribe('AuthorisationsChanged', identityAddress, callback);
    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.not.been.called;
  });

  it('observation: one new request', async () => {
    const callback = sinon.spy();
    relayerObserver.start();
    await relayerObserver.subscribe('AuthorisationsChanged', identityAddress, callback);
    const privateKey = await sdk.connect(identityAddress, 'Some label');
    const {address} = new ethers.Wallet(privateKey);
    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.been.calledWith(sinon.match([{index: 0, key: address, label: 'Some label'}]));
  });

  it('AuthorisationChanged for multiple identities', async () => {
    const [, newIdentityAddress] = await sdk.create('newlogin.mylogin.eth');
    const callback = sinon.spy();
    sdk.relayerObserver.start();

    await relayerObserver.subscribe('AuthorisationsChanged', identityAddress, callback);
    await relayerObserver.subscribe('AuthorisationsChanged', newIdentityAddress, callback);

    await sdk.connect(identityAddress, 'Some label');
    await sdk.connect(newIdentityAddress, 'Some label');

    await relayerObserver.finalizeAndStop();
    expect(callback).to.have.been.calledTwice;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
