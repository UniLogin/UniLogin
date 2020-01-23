import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Contract, Wallet, providers, utils} from 'ethers';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {RelayerUnderTest} from '@universal-login/relayer';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@universal-login/commons';
import {waitExpect} from '@universal-login/commons/testutils';
import {mineBlock} from '@universal-login/contracts/testutils';
import basicSDK from '../fixtures/basicSDK';
import UniversalLoginSDK from '../../src/api/sdk';
import {Callback} from 'reactive-properties/dist/Property';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

const gasPrice = DEFAULT_GAS_PRICE;
const gasLimit = DEFAULT_GAS_LIMIT;

describe('INT: Events', async () => {
  let relayer: RelayerUnderTest;
  let provider: providers.Provider;
  let sdk: UniversalLoginSDK;
  let contractAddress: string;
  let wallet: Wallet;
  let privateKey: string;
  let mockToken: Contract;
  let unsubscribe: Callback;
  const connectionCallback = sinon.spy();

  before(async () => {
    ({sdk, relayer, mockToken, privateKey, contractAddress, wallet, provider} = await loadFixture(basicSDK));
    sdk.start();
    unsubscribe = await sdk.subscribeAuthorisations(contractAddress, privateKey, connectionCallback);
  });

  it('create, request connection, addKey roundtrip', async () => {
    const keyCallback = sinon.spy();
    const newKeySDK = new UniversalLoginSDK(relayer.url(), provider);
    await newKeySDK.start();
    const {privateKey: newPrivateKey} = await newKeySDK.connect(contractAddress);
    const publicKeyToAdd = utils.computeAddress(newPrivateKey);
    await newKeySDK.subscribe('KeyAdded', {contractAddress, key: publicKeyToAdd}, keyCallback);
    await sdk.addKey(contractAddress, publicKeyToAdd.toLowerCase(), privateKey, {gasPrice, gasLimit, gasToken: mockToken.address});
    await mineBlock(wallet);
    await waitExpect(() => expect(keyCallback).to.have.been.calledOnce);
    await sdk.finalizeAndStop();
    await newKeySDK.finalizeAndStop();
    unsubscribe();
    expect(keyCallback).to.have.been.calledWith({key: publicKeyToAdd});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
