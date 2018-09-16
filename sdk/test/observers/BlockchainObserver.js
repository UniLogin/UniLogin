import fetch from 'node-fetch';
import chai from 'chai';
import EthereumIdentitySDK from '../../lib/sdk';
import {RelayerUnderTest} from 'ethereum-identity-sdk-relayer';
import {createMockProvider, solidity} from 'ethereum-waffle';
chai.use(solidity);


const RELAYER_URL = 'http://127.0.0.1:3311';

global.fetch = fetch;

describe('SDK: RelayerObserver', async () => {
  let provider;
  let relayer;
  let sdk;
  let blockchainObserver;

  beforeEach(async () => {
    provider = createMockProvider();
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(RELAYER_URL, provider);
    ({blockchainObserver} = sdk);
    blockchainObserver.step = 50;
    // [, identityAddress] = await sdk.create('alex.mylogin.eth');
    // sponsor.send(identityAddress, 10000);
  });


  it('reports an KeyAdded event', async () => {

  });

  xit('reports just events for given address an event', async () => {
  });


  afterEach(async () => {
    await relayer.stop();
  });
});
