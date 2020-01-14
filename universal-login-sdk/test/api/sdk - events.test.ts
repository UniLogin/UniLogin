import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Contract, Wallet} from 'ethers';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../src/api/sdk';
import {waitExpect} from '@universal-login/commons/testutils';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

const gasPrice = DEFAULT_GAS_PRICE;
const gasLimit = DEFAULT_GAS_LIMIT;

describe('INT: Events', async () => {
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
    const paymentOptions = {gasPrice, gasLimit, gasToken: mockToken.address};
    await sdk.addKey(contractAddress, wallet.address, privateKey, paymentOptions);
    await waitExpect(() => expect(keyCallback).to.have.been.calledOnce, 3000);
    await sdk.finalizeAndStop();
    unsubscribe();
    expect(keyCallback).to.have.been.calledWith({key: wallet.address});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
