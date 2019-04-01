import {ReactWrapper} from 'enzyme';
import React from 'react';
import {expect} from 'chai';
import {mountWithContext} from '../helpers/CustomMount';
import App from '../../src/ui/App';
import {providers, Wallet, utils} from 'ethers';
import {Services} from '../../src/services/Services';
import {setupSdk} from 'universal-login-sdk/test';
import {ETHER_NATIVE_TOKEN} from 'universal-login-commons';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {AppPage} from '../pages/AppPage';
import {getWallets} from 'ethereum-waffle';

describe('UI: Connect', () => {
  let services : Services;
  let relayer: any;
  let provider: providers.Web3Provider;
  let appWrapper: ReactWrapper;
  let wallet: Wallet;

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: 33113}));
    [wallet] = await getWallets(provider);
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
  });

  it('Should connect to existing wallet', async () => {
    const name = 'name.mylogin.eth';
    const [privateKey, contractAddress] = await services.sdk.create(name);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    appWrapper = mountWithContext(<App/>, services, ['/', '/login']);
    const appPage = new AppPage(appWrapper);
    await appPage.login().connect(name);
    // await services.sdk.addKey()
  });

  after(async () => {
    appWrapper.unmount();
    await relayer.stop();
  });
});
