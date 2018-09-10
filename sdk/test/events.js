import fetch from 'node-fetch';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../lib/sdk';
import {RelayerUnderTest} from 'ethereum-identity-sdk-relayer';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import ethers from 'ethers';

chai.use(solidity);
chai.use(sinonChai);

const {expect} = chai;

const RELAYER_URL = 'http://127.0.0.1:3311';

global.fetch = fetch;

describe('SDK - Events', async () => {
  let provider;
  let relayer;
  let sdk;  
  let sponsor;
  let identityAddress;

  beforeEach(async () => {
    provider = createMockProvider();
    [sponsor] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(RELAYER_URL, provider);
    sdk.step = 50;  
    [, identityAddress] = await sdk.create('alex.mylogin.eth');
    sponsor.send(identityAddress, 10000);
  });


  it('checkAuthorisationRequests should not emit AuthorisationsChanged event', async () => {
    const callback = sinon.spy();
    await sdk.subscribe('AuthorisationsChanged', identityAddress, callback);
    await sdk.checkAuthorisationRequests();
    expect(callback).to.have.not.been.called;
  });

  it('checkAuthorisationRequests should emit AuthorisationsChanged event when requestAuthorisation called', async () => {
    const callback = sinon.spy();
    await sdk.subscribe('AuthorisationsChanged', identityAddress, callback); 
    const privateKey = await sdk.requestAuthorisation(identityAddress, 'Some label');
    const {address} = new ethers.Wallet(privateKey);
    await sdk.checkAuthorisationRequests();
    expect(callback).to.have.been.calledWith(sinon.match({index: 0, key: address, label: 'Some label'}));
  });

  it('no new reuqests', async () => {
    const callback = sinon.spy();
    sdk.start();
    await sdk.subscribe('AuthorisationsChanged', identityAddress, callback);         
    await sdk.finalizeAndStop();
    expect(callback).to.have.not.been.called;
  });
  
  it('one new request', async () => {
    const callback = sinon.spy();
    sdk.start();
    await sdk.subscribe('AuthorisationsChanged', identityAddress, callback); 
    const privateKey = await sdk.requestAuthorisation(identityAddress, 'Some label');
    const {address} = new ethers.Wallet(privateKey);
    await sdk.finalizeAndStop();
    expect(callback).to.have.been.calledWith(sinon.match({index: 0, key: address, label: 'Some label'}));        
  });

  it('AuthorisationChanged for multiple identities', async () => {
    const [, newIdentityAddress] = await sdk.create('newlogin.mylogin.eth');
    const callback = sinon.spy();
    sdk.start();

    await sdk.subscribe('AuthorisationsChanged', identityAddress, callback); 
    await sdk.subscribe('AuthorisationsChanged', newIdentityAddress, callback); 
    
    await sdk.requestAuthorisation(identityAddress, 'Some label');
    await sdk.requestAuthorisation(newIdentityAddress, 'Some label');

    await sdk.finalizeAndStop();
    expect(callback).to.have.been.calledTwice;     
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
