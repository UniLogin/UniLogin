import React from 'react';
import {providers} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {ReactWrapper} from 'enzyme';
import chai, {expect} from 'chai';
import {createWallet, setupSdk} from '@unilogin/sdk/testutils';
import {ETHER_NATIVE_TOKEN, TEST_GAS_PRICE} from '@unilogin/commons';
import Relayer from '@unilogin/relayer';
import {createPreconfiguredServices} from '../testhelpers/ServicesUnderTests';
import {mountWithContext} from '../testhelpers/CustomMount';
import {Services} from '../../src/ui/createServices';
import App from '../../src/ui/react/App';
import {AppPage} from '../pages/AppPage';

chai.use(require('chai-string'));

describe('UI: Startup from stored wallet state', () => {
  let services: Services;
  let relayer: Relayer;
  let provider: providers.Provider;
  let appWrapper: ReactWrapper;
  let privateKey: string;
  let contractAddress: string;
  const name = 'name.mylogin.eth';

  beforeEach(async () => {
    const [wallet] = getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    ({privateKey, contractAddress} = await createWallet(name, services.sdk, wallet));
  });

  it('starts when storage is empty', async () => {
    services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is None', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'None'}));
    services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is Future', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'Future', name, wallet: {contractAddress, privateKey, ensName: name, gasPrice: TEST_GAS_PRICE, gasToken: ETHER_NATIVE_TOKEN.address}}));
    services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/create/topUp']);
    expect(appWrapper.text().includes('Choose a top-up method')).to.be.true;
  });

  it('starts when storage is Deployed', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'Deployed', wallet: {name, privateKey, contractAddress}}));
    services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    const appPage = new AppPage(appWrapper);
    await appPage.dashboard().waitForDashboard();
    expect(appWrapper.text().includes('My Assets')).to.be.true;
  });

  afterEach(async () => {
    appWrapper.unmount();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
