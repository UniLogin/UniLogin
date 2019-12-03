import React from 'react';
import {providers} from 'ethers';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {ReactWrapper} from 'enzyme';
import chai, {expect} from 'chai';
import {createWallet, setupSdk} from '@universal-login/sdk/testutils';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import Relayer from '@universal-login/relayer';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {Services} from '../../../src/ui/createServices';
import App from '../../../src/ui/react/App';
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
    await services.sdk.tokensDetailsStore.fetchTokensDetails();
    await services.sdk.start();
    ({privateKey, contractAddress} = await createWallet(name, services.sdk, wallet));
  });

  it('starts when storage is empty', async () => {
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is None', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'None'}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  it('starts when storage is Future', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'Future', name, wallet: {contractAddress, privateKey}}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/create/topUp']);
    expect(appWrapper.text().includes('Choose a top-up method')).to.be.true;
  });

  it('starts when storage is Deployed', async () => {
    services.storageService.set('wallet', JSON.stringify({kind: 'Deployed', wallet: {name, privateKey, contractAddress}}));
    await services.walletService.loadFromStorage();
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    const appPage = new AppPage(appWrapper);
    await appPage.dashboard().waitForDashboard();
    expect(appWrapper.text().includes('My Assets')).to.be.true;
  });

  afterEach(async () => {
    await services.sdk.finalizeAndStop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
