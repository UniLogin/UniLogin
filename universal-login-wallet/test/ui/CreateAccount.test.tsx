import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, utils} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {setupSdk} from '@unilogin/sdk/testutils';
import App from '../../src/ui/react/App';
import {Services} from '../../src/ui/createServices';
import {createPreconfiguredServices} from '../testhelpers/ServicesUnderTests';
import {mountWithContext} from '../testhelpers/CustomMount';
import {AppPage} from '../pages/AppPage';

describe('UI: Creation flow', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let provider: providers.Provider;
  const expectedHomeBalance = '$1.99';

  before(async () => {
    const [wallet] = getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
  });

  it('create wallet and disconnect roundtrip', async () => {
    appWrapper = mountWithContext(<App/>, services, ['/wallet']);
    const appPage = new AppPage(appWrapper);
    appPage.login().clickCreateOne();
    appPage.login().approveTerms();
    await appPage.login().createNew('super-name');
    appPage.creation().chooseTopUpMethod();
    const address = appPage.creation().getAddress();
    expect(address).to.be.an('string');
    const [wallet] = getWallets(provider);
    await wallet.sendTransaction({to: address as string, value: utils.parseEther('2.0')});
    await appPage.creation().waitAndGoToWallet(4000);
    await appPage.login().waitForHomeView(expectedHomeBalance);
    expect(appWrapper.text().includes(expectedHomeBalance)).to.be.true;
    expect(appWrapper.find('a.button-secondary')).to.have.length(0);
    await appPage.dashboard().disconnect();
    await appPage.dashboard().waitForWelcomeScreen();
    expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
  });

  after(async () => {
    appWrapper.unmount();
    await relayer.stop();
  });
});
