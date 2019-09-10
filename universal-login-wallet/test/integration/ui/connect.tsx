import {getWallets, createMockProvider} from 'ethereum-waffle';
import {ReactWrapper} from 'enzyme';
import chai, {expect} from 'chai';
import React from 'react';
import {setupSdk, createWallet} from '@universal-login/sdk/testutils';
import {ETHER_NATIVE_TOKEN, waitExpect} from '@universal-login/commons';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {Services} from '../../../src/ui/createServices';
import App from '../../../src/ui/react/App';
import {providers, Wallet} from 'ethers';
import {AppPage} from '../pages/AppPage';
import Relayer from '@universal-login/relayer';

chai.use(require('chai-string'));


describe('UI: Connection flow', () => {
  let services : Services;
  let relayer: Relayer;
  let provider: providers.Provider;
  let appWrapper: ReactWrapper;
  let privateKey : string;
  let contractAddress : string;
  const name = 'name.mylogin.eth';

  beforeEach(async () => {
    const [wallet] = getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    await services.sdk.tokensDetailsStore.fetchTokensDetails();
    await services.sdk.start();
    ({privateKey, contractAddress} = await createWallet(name, services.sdk, wallet));
    appWrapper = mountWithContext(<App/>, services, ['/']);
  });

  it('Should connect to existing wallet', async () => {
    const appPage = new AppPage(appWrapper);
    appPage.login().clickConnectToExisting();
    await appPage.login().connect(name);
    appPage.connection().clickConnectWithAnotherDevice();
    await appPage.connection().waitForEmojiView();
    const publicKey = (new Wallet(services.walletService.getConnectingWallet().privateKey)).address;
    await services.sdk.addKey(contractAddress, publicKey, privateKey, {gasToken: ETHER_NATIVE_TOKEN.address});
    await waitExpect(() => expect(services.walletPresenter.getName()).to.be.eq(name));
    await appPage.login().waitForHomeView('1.9998');
    expect(appPage.dashboard().getWalletBalance()).to.startWith('1.9998');
  });

  it('Cancel connection', async () => {
    const appPage = new AppPage(appWrapper);
    appPage.login().clickConnectToExisting();
    await appPage.login().connect(name);
    appPage.connection().clickConnectWithAnotherDevice();
    await appPage.connection().waitForEmojiView();
    await appPage.connection().clickCancel();
    await appPage.connection().waitForConnectionChoiceView();
    expect(appPage.connection().getConnectionWithPassphraseText()).to.startWith('Connect with passphrase');
  });

  afterEach(async () => {
    await services.sdk.finalizeAndStop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
