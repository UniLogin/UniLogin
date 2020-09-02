import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {Contract, Wallet, utils, providers} from 'ethers';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {DEFAULT_GAS_LIMIT, TEST_SDK_CONFIG, TEST_GAS_PRICE_IN_TOKEN} from '@unilogin/commons';
import {waitExpect, mineBlock} from '@unilogin/commons/testutils';
import basicSDK from '../fixtures/basicSDK';
import UniLoginSdk from '../../src/api/sdk';
import {DeployedWallet} from '../../src';
import {Callback} from 'reactive-properties';

chai.use(solidity);
chai.use(sinonChai);

const loadFixture = createFixtureLoader();

const gasPrice = TEST_GAS_PRICE_IN_TOKEN;
const gasLimit = DEFAULT_GAS_LIMIT;

describe('INT: Events', () => {
  let relayer: RelayerUnderTest;
  let provider: providers.JsonRpcProvider;
  let sdk: UniLoginSdk;
  let deployedWallet: DeployedWallet;
  let contractAddress: string;
  let wallet: Wallet;
  let privateKey: string;
  let mockToken: Contract;
  let unsubscribe: Callback;
  const connectionCallback = sinon.spy();

  before(async () => {
    ({sdk, relayer, mockToken, privateKey, contractAddress, wallet, provider} = await loadFixture(basicSDK));
    await sdk.start();
    unsubscribe = await sdk.subscribeAuthorisations(contractAddress, privateKey, connectionCallback);
    deployedWallet = new DeployedWallet(contractAddress, '', privateKey, sdk, '');
  });

  it('create, request connection, addKey roundtrip', async () => {
    const keyCallback = sinon.spy();
    const newKeySDK = new UniLoginSdk(relayer.url(), provider, TEST_SDK_CONFIG);
    await newKeySDK.start();
    const {privateKey: newPrivateKey} = await newKeySDK.connect(contractAddress);
    const publicKeyToAdd = utils.computeAddress(newPrivateKey);
    newKeySDK.subscribe('AddedOwner', {contractAddress, key: publicKeyToAdd}, keyCallback);
    await deployedWallet.addKey(publicKeyToAdd.toLowerCase(), {gasPrice, gasLimit, gasToken: mockToken.address});
    await mineBlock(wallet);
    await waitExpect(() => expect(keyCallback).to.have.been.calledOnce);
    unsubscribe();
    await sdk.finalizeAndStop();
    await newKeySDK.finalizeAndStop();
    expect(keyCallback).to.have.been.calledWith({key: publicKeyToAdd});
    expect(connectionCallback).to.have.been.called;
  });

  after(async () => {
    await relayer.stop();
  });
});
