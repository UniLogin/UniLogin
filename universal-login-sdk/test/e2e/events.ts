import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Contract, Wallet} from 'ethers';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import basicSDK from '../fixtures/basicSDK';
import {SdkConfigDefault} from '../../lib/config/SdkConfigDefault';
import UniversalLoginSDK from '../../lib/api/sdk';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

describe('E2E: Events', async () => {
  let relayer: RelayerUnderTest;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let wallet: Wallet;
  let privateKey: string;
  let mockToken: Contract;

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
    const paymentOptions = {...SdkConfigDefault.paymentOptions, gasToken: mockToken.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, paymentOptions);
    await sdk.finalizeAndStop();
    unsubscribe();
    expect(keyCallback).to.have.been.calledWith({key: wallet.address});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
