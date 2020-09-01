import React from 'react';
import {providers, Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {ReactWrapper} from 'enzyme';
import chai, {expect} from 'chai';
import {createWallet, setupSdk, TEST_STORAGE_KEY} from '@unilogin/sdk/testutils';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@unilogin/commons';
import Relayer from '@unilogin/relayer';
import {createPreconfiguredServices} from '../testhelpers/ServicesUnderTests';
import {mountWithContext} from '../testhelpers/CustomMount';
import {Services} from '../../src/ui/createServices';
import App from '../../src/ui/react/App';
import {AppPage} from '../pages/AppPage';
import sinon from 'sinon';

chai.use(require('chai-string'));

describe('UI: Startup from stored wallet state', () => {
  let services: Services;
  let relayer: Relayer;
  let provider: providers.JsonRpcProvider;
  let appWrapper: ReactWrapper;
  let wallet: Wallet;
  const name = 'name.mylogin.eth';

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets();
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
  });

  it('starts when storage is empty', async () => {
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is None', async () => {
    services.storageService.set(TEST_STORAGE_KEY, JSON.stringify({kind: 'None'}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is Future', async () => {
    services.storageService.set(TEST_STORAGE_KEY, JSON.stringify({kind: 'Future', name, wallet: {contractAddress: TEST_CONTRACT_ADDRESS, privateKey: TEST_PRIVATE_KEY, ensName: name, gasPrice: TEST_GAS_PRICE, gasToken: ETHER_NATIVE_TOKEN.address}}));
    await services.walletService.loadFromStorage();
    services.walletService.getFutureWallet().waitForBalance = sinon.fake.resolves({});
    services.walletService.initDeploy = sinon.fake.resolves({});
    appWrapper = mountWithContext(<App/>, services, ['/create/topUp']);
    expect(appWrapper.text().includes('Choose a top-up method')).to.be.true;
  });

  it('starts when storage is DeployedWithoutEmail', async () => {
    const {privateKey, contractAddress} = await createWallet(name, services.sdk, wallet);
    services.storageService.set(TEST_STORAGE_KEY, JSON.stringify({kind: 'DeployedWithoutEmail', wallet: {name, privateKey, contractAddress}}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
    const appPage = new AppPage(appWrapper);
    await appPage.dashboard().waitForDashboard();
    expect(appWrapper.text().includes('Tokens')).to.be.true;
    expect(appWrapper.text().includes('Collectables')).to.be.true;
  });

  it('starts when storage is Deployed', async () => {
    const email = 'user@unilogin.test';
    const {privateKey, contractAddress} = await createWallet(name, services.sdk, wallet, email);
    services.storageService.set(TEST_STORAGE_KEY, JSON.stringify({kind: 'Deployed', wallet: {name, privateKey, contractAddress, email}}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
    const appPage = new AppPage(appWrapper);
    await appPage.dashboard().waitForDashboard();
    expect(appWrapper.text().includes('Tokens')).to.be.true;
    expect(appWrapper.text().includes('Collectables')).to.be.true;
  });

  it('starts when storage is Deployed without email', async () => {
    const {privateKey, contractAddress} = await createWallet(name, services.sdk, wallet);
    services.storageService.set(TEST_STORAGE_KEY, JSON.stringify({kind: 'Deployed', wallet: {name, privateKey, contractAddress}}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/dashboard']);
    const appPage = new AppPage(appWrapper);
    await appPage.dashboard().waitForDashboard();
    expect(appWrapper.text().includes('Tokens')).to.be.true;
    expect(appWrapper.text().includes('Collectables')).to.be.true;
    expect(services.walletService.state.kind).to.eq('DeployedWithoutEmail');
  });

  afterEach(async () => {
    appWrapper.unmount();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
