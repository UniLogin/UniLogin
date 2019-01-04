import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {solidity} from 'ethereum-waffle';
import sinon from 'sinon';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicSDK, {addKeyMessage} from './fixtures/basicSDK';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK - events', async () => {
  const testHelper = new TestHelper();
  let relayer;
  let sdk;
  let contractAddress;
  let wallet;
  let privateKey;
  let mockToken;

  before(async () => {
    ({sdk, relayer, mockToken, privateKey, contractAddress, wallet} = await testHelper.load(basicSDK));
  });


  it('create, request connection, addKey roundtrip', async () => {
    const connectionCallback = sinon.spy();
    const keyCallback = sinon.spy();

    sdk.start();

    await sdk.subscribe('AuthorisationsChanged', {contractAddress}, connectionCallback);
    await sdk.subscribe('KeyAdded', {contractAddress, key: wallet.address}, keyCallback);

    await sdk.connect(contractAddress);
    const paymentOptions = {...addKeyMessage, gasToken: mockToken.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, paymentOptions);
    await sdk.finalizeAndStop();
    expect(keyCallback).to.have.been.calledWith({key: wallet.address.toLowerCase(), keyType: 1, purpose: 1});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
