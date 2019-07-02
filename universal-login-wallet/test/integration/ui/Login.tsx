import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, utils} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {setupSdk} from '../helpers/setupSdk';
import App from '../../../src/ui/react/App';
import {Services} from '../../../src/ui/Services';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {AppPage} from '../pages/AppPage';

describe('UI: Login', () => {
    let appWrapper: ReactWrapper;
    let services: Services;
    let relayer: any;
    let provider: providers.Provider;
    const expectedHomeBalance = '1.99999';

    before(async () => {
        const [wallet] = await getWallets(createMockProvider());
        ({relayer, provider} = await setupSdk(wallet, '33113'));
        services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
        services.tokenService.start();
        services.balanceService.start();
    });

    it('create wallet and disconnect roundtrip', async () => {
        appWrapper = mountWithContext(<App/>, services, ['/']);
        const appPage = new AppPage(appWrapper);
        await appPage.login().pickUsername('super-name', 'create new', 'Top up your account');
        const address = await appPage.login().getAddress();
        const [wallet] = await getWallets(provider);
        await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
        await appPage.login().waitForHomeView(expectedHomeBalance);
        expect(appWrapper.text().includes(expectedHomeBalance)).to.be.true;
        appPage.dashboard().disconnect();
        expect(appWrapper.text().includes('Type a nickname you want')).to.be.true;
    });

    after(async () => {
        services.balanceService.stop();
        appWrapper.unmount();
        await relayer.stop();
    });
});
