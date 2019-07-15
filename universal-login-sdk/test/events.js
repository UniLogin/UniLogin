import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import sinon from 'sinon';
import MESSAGE_DEFAULTS from '../lib/MessageDefaults';
import basicSDK from './fixtures/basicSDK';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

describe('SDK - events', async () => {
  let relayer;
  let sdk;
  let contractAddress;
  let wallet;
  let privateKey;
  let mockToken;

  before(async () => {
    ({sdk, relayer, mockToken, privateKey, contractAddress, wallet} = await loadFixture(basicSDK));
  });


  it('create, request connection, addKey roundtrip', async () => {
    const connectionCallback = sinon.spy();
    const keyCallback = sinon.spy();

    sdk.start();

    const unsubscribe = await sdk.subscribeAuthorisations(contractAddress, privateKey, connectionCallback);
    await sdk.subscribe('KeyAdded', {contractAddress, key: wallet.address}, keyCallback);

    await sdk.connect(contractAddress);
    const paymentOptions = {...MESSAGE_DEFAULTS, gasToken: mockToken.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, paymentOptions);
    await sdk.finalizeAndStop();
    unsubscribe();
    expect(keyCallback).to.have.been.calledWith({key: wallet.address.toLowerCase(), purpose: 1});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
