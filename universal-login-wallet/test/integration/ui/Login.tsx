import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, Wallet, utils} from 'ethers';
import {getWallets} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {setupSdk} from '@universal-login/sdk/test';
import App from '../../../src/ui/App';
import {Services} from '../../../src/services/Services';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {AppPage} from '../pages/AppPage';

describe('UI: Login', () => {
    let appWrapper: ReactWrapper;
    let services: Services;
    let relayer: any;
    let provider: providers.Provider;
    let wallet: Wallet;

    before(async () => {
        ({relayer, provider} = await setupSdk({overridePort: '33113'}));
        [wallet] = await getWallets(provider);
        services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
        await services.tokenService.start();
        services.balanceService.start();
    });

    it('create wallet and disconnect roundtrip', async () => {
        appWrapper = mountWithContext(<App/>, services, ['/']);
        const appPage = new AppPage(appWrapper);
        await appPage.login().pickUsername('super-name', 'create new', 'Transfer one of following');
        const address = appPage.login().getAddress();
        const [wallet] = await getWallets(provider);
        await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
        await appPage.login().waitForHomeView('2.0');
        expect(appWrapper.text().includes('2.0')).to.be.true;
        appPage.dashboard().disconnect();
        expect(appWrapper.text().includes('Type a nickname you want')).to.be.true;
    });

    after(async () => {
        services.balanceService.stop();
        appWrapper.unmount();
        await relayer.stop();
    });
});
