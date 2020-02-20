import {getWallets, createMockProvider} from 'ethereum-waffle';
import {ReactWrapper} from 'enzyme';
import chai, {expect} from 'chai';
import React from 'react';
import {setupSdk, createWallet} from '@unilogin/sdk/testutils';
import {ETHER_NATIVE_TOKEN, DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {createPreconfiguredServices} from '../testhelpers/ServicesUnderTests';
import {mountWithContext} from '../testhelpers/CustomMount';
import {Services} from '../../src/ui/createServices';
import App from '../../src/ui/react/App';
import {providers, Wallet} from 'ethers';
import {AppPage} from '../pages/AppPage';
import Relayer from '@unilogin/relayer';

chai.use(require('chai-string'));

const gasPrice = DEFAULT_GAS_PRICE;
const gasLimit = DEFAULT_GAS_LIMIT;
const gasToken = ETHER_NATIVE_TOKEN.address;

describe('UI: Connection flow', () => {
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
    services = await createPreconfiguredServices(provider, relayer, [gasToken]);
    await services.sdk.tokensDetailsStore.fetchTokensDetails();
    await services.sdk.start();
    ({privateKey, contractAddress} = await createWallet(name, services.sdk, wallet));
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
  });

  it('Should connect to existing wallet', async () => {
    const appPage = new AppPage(appWrapper);
    appPage.login().clickConnectToExisting();
    await appPage.login().connect(name);
    appPage.connection().clickConnectWithAnotherDevice();
    await appPage.connection().waitForEmojiView();
    const publicKey = (new Wallet(services.walletService.getConnectingWallet().privateKey)).address;
    await services.sdk.addKey(contractAddress, publicKey, privateKey, {gasPrice, gasLimit, gasToken});
    await waitExpect(() => expect(services.walletPresenter.getName()).to.eq(name));
    await appPage.login().waitForCongratulations();
    await appPage.login().goToHomeView();
    expect(appPage.dashboard().getWalletBalance()).to.startWith('$1.99');
  });

  it('Cancel connection', async () => {
    const appPage = new AppPage(appWrapper);
    appPage.login().clickConnectToExisting();
    await appPage.login().connect(name);
    appPage.connection().clickConnectWithAnotherDevice();
    await appPage.connection().waitForEmojiView();
    appPage.connection().clickCancel();
    await appPage.connection().waitForConnectionChoiceView();
    expect(appWrapper.text()).to.startWith('Connect with another device');
  });

  afterEach(async () => {
    await services.sdk.finalizeAndStop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
