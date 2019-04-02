import {ReactWrapper} from 'enzyme';
import React from 'react';
import {mountWithContext} from '../helpers/CustomMount';
import App from '../../src/ui/App';
import {providers, Wallet, utils} from 'ethers';
import {Services} from '../../src/services/Services';
import {setupSdk} from 'universal-login-sdk/test';
import {ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {AppPage} from '../pages/AppPage';
import {getWallets} from 'ethereum-waffle';
import {expect} from 'chai';


describe('UI: Connect', () => {
  let services : Services;
  let relayer: any;
  let provider: providers.Web3Provider;
  let appWrapper: ReactWrapper;
  let privateKey : string;
  let contractAddress : string;
  const name = 'name.mylogin.eth';

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: 33113}));
    const [wallet] = await getWallets(provider);
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    services.tokenService.start();
    services.balanceService.start();
    services.sdk.start();
    [privateKey, contractAddress] = await services.sdk.create(name);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    appWrapper = mountWithContext(<App/>, services, ['/']);
  });

  it('Should connect to existing wallet', async () => {
    const appPage = new AppPage(appWrapper);
    await appPage.login().connect(name);
    const publicKey = (new Wallet(services.walletService.userWallet!.privateKey)).address;
    await services.sdk.addKey(contractAddress, publicKey, privateKey, {gasToken: ETHER_NATIVE_TOKEN.address});
    await appPage.login().waitForHomeView('');
    const balance = appPage.dashboard().getWalletBalance();
    expect(balance).to.eq('1.999910289');
  });

  after(async () => {
    services.balanceService.stop();
    await services.sdk.finalizeAndStop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
