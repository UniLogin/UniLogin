import {ReactWrapper} from 'enzyme';
import React from 'react';
import {mountWithContext} from '../helpers/CustomMount';
import App from '../../../src/ui/react/App';
import {providers, Wallet, utils} from 'ethers';
import {Services} from '../../../src/ui/createServices';
import {setupSdk} from '../helpers/setupSdk';
import {ETHER_NATIVE_TOKEN, waitExpect} from '@universal-login/commons';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {AppPage} from '../pages/AppPage';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import chai, {expect} from 'chai';

chai.use(require('chai-string'));


describe('UI: Connection flow', () => {
  let services : Services;
  let relayer: any;
  let provider: providers.Provider;
  let appWrapper: ReactWrapper;
  let privateKey : string;
  let contractAddress : string;
  const name = 'name.mylogin.eth';

  before(async () => {
    const [wallet] = getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    await services.tokensDetailsStore.aggregateTokensDetails();
    services.balanceService.start();
    services.sdk.start();
    [privateKey, contractAddress] = await services.sdk.create(name);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    appWrapper = mountWithContext(<App/>, services, ['/']);
  });

  it('Should connect to existing wallet', async () => {
    const appPage = new AppPage(appWrapper);
    appPage.login().clickConnectToExisting();
    await appPage.login().connect(name);
    appPage.connection().clickConnectWithAnotherDevice();
    await appPage.connection().waitForEmojiView();
    await waitExpect(() => expect(services.walletPresenter.getName()).to.be.eq(name));
    const publicKey = (new Wallet(services.walletService.applicationWallet!.privateKey)).address;
    await services.sdk.addKey(contractAddress, publicKey, privateKey, {gasToken: ETHER_NATIVE_TOKEN.address});
    await appPage.login().waitForHomeView('');
    expect(appPage.dashboard().getWalletBalance()).to.startWith('1.9999');
  });

  after(async () => {
    services.balanceService.stop();
    await services.sdk.finalizeAndStop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
