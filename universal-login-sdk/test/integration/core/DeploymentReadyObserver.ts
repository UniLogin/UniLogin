import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, providers, Contract} from 'ethers';
import {deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, sleep, waitUntil} from '@universal-login/commons';
import MockToken from '@universal-login/contracts/build/MockToken.json';
import {DeploymentReadyObserver} from '../../../lib/core/observers/DeploymentReadyObserver';

describe('INT: DeploymentReadyObserver', () => {
  let deploymentReadyObserver: DeploymentReadyObserver;
  let provider: providers.Provider;
  let wallet: Wallet;
  let mockToken: Contract;
  const minimalAmount =  utils.parseEther('0.5').toString();
  let supportedTokens = [
    {
      address: ETHER_NATIVE_TOKEN.address,
      minimalAmount
    }
  ];
  let callback: sinon.SinonSpy;
  let unsubscribe: any;


  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, MockToken);
    supportedTokens = [...supportedTokens, {address: mockToken.address, minimalAmount}];
    callback = sinon.spy();
    deploymentReadyObserver = new DeploymentReadyObserver(supportedTokens, provider);
    deploymentReadyObserver.step = 10;
    unsubscribe = await deploymentReadyObserver.startAndSubscribe(TEST_ACCOUNT_ADDRESS, callback);
  });

  it('calls callback if ether balance changed', async () => {
    await wallet.sendTransaction({to: TEST_ACCOUNT_ADDRESS, value: utils.parseEther('1.0')});
    await waitUntil(() => !!callback.firstCall);
    expect(callback).to.have.been.calledWith(ETHER_NATIVE_TOKEN.address, TEST_ACCOUNT_ADDRESS);
    unsubscribe();
  });

  it('calls callback if token balance changed', async () => {
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('1.0'));
    await waitUntil(() => !!callback.firstCall);

    expect(callback).to.have.been.calledWith(mockToken.address, TEST_ACCOUNT_ADDRESS);
    unsubscribe();
  });

  it('shouldn`t call callback if token balance is smaller than minimalAmount', async () => {
    await mockToken.transfer(TEST_ACCOUNT_ADDRESS, utils.parseEther('0.49'));
    await sleep(50);
    expect(callback).to.not.have.been.called;
    unsubscribe();
  });

  it('should throw error if is already started', () => {
    expect(deploymentReadyObserver.startAndSubscribe(TEST_ACCOUNT_ADDRESS, callback))
      .to.be.rejectedWith('Other wallet waiting for counterfactual deployment. Stop observer to cancel old wallet instantialisation.');
  });

  afterEach(async () => {
    await deploymentReadyObserver.finalizeAndStop();
  });
});
