import {expect} from 'chai';
import sinon from 'sinon';
import {utils, Wallet, providers, Contract} from 'ethers';
import {deployContract, createMockProvider, getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TEST_ACCOUNT_ADDRESS, sleep, waitUntil} from '@unilogin/commons';
import {mockContracts} from '@unilogin/contracts/testutils';
import {DeploymentReadyObserver} from '../../../src/core/observers/DeploymentReadyObserver';

describe('INT: DeploymentReadyObserver', () => {
  let deploymentReadyObserver: DeploymentReadyObserver;
  let provider: providers.Provider;
  let wallet: Wallet;
  let mockToken: Contract;
  const minimalAmount = '0.5';
  let supportedTokens = [
    {
      address: ETHER_NATIVE_TOKEN.address,
      minimalAmount,
    },
  ];
  let callback: sinon.SinonSpy;
  let unsubscribe: any;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, mockContracts.MockToken);
    supportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount},
      {address: mockToken.address, minimalAmount}];
    callback = sinon.spy();
    deploymentReadyObserver = new DeploymentReadyObserver(supportedTokens, provider);
    deploymentReadyObserver.tick = 10;
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

  it('set supported tokens, none token', () => {
    const deploymentReadyObserver = new DeploymentReadyObserver([], provider);
    deploymentReadyObserver.setSupportedToken({address: ETHER_NATIVE_TOKEN.address, minimalAmount: '1'});
    expect(deploymentReadyObserver.getSupportedToken()).to.deep.eq([]);
  });

  it('set supported tokens, 1 token', () => {
    const deploymentReadyObserver = new DeploymentReadyObserver([{address: ETHER_NATIVE_TOKEN.address, minimalAmount: '0.5'}], provider);
    const newSupportedTokens = {address: ETHER_NATIVE_TOKEN.address, minimalAmount: '1'};
    deploymentReadyObserver.setSupportedToken(newSupportedTokens);
    expect(deploymentReadyObserver.getSupportedToken()).to.deep.eq([newSupportedTokens]);
  });

  it('set supported tokens, 1 token and trying to add new one', () => {
    const deploymentReadyObserver = new DeploymentReadyObserver([{address: ETHER_NATIVE_TOKEN.address, minimalAmount: '0.5'}], provider);
    deploymentReadyObserver.setSupportedToken({address: mockToken.address, minimalAmount: '1'});
    const expectedSupportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: '0.5'}];
    expect(deploymentReadyObserver.getSupportedToken()).to.deep.eq(expectedSupportedTokens);
  });

  it('set supported tokens, 2 tokens', () => {
    deploymentReadyObserver.setSupportedToken({address: ETHER_NATIVE_TOKEN.address, minimalAmount: '1'});
    const expectedSupportedTokens = [{address: ETHER_NATIVE_TOKEN.address, minimalAmount: '1'}, {address: mockToken.address, minimalAmount}];
    expect(deploymentReadyObserver.getSupportedToken()).to.deep.eq(expectedSupportedTokens);
  });

  afterEach(async () => {
    await deploymentReadyObserver.finalizeAndStop();
  });
});
