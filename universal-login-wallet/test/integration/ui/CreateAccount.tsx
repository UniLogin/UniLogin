import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, utils} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {setupSdk} from '../helpers/setupSdk';
import App from '../../../src/ui/react/App';
import {Services} from '../../../src/ui/createServices';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {AppPage} from '../pages/AppPage';

describe('UI: Creation flow', () => {
    let appWrapper: ReactWrapper;
    let services: Services;
    let relayer: any;
    let provider: providers.Provider;
    const expectedHomeBalance = '1.9955';

    before(async () => {
        const [wallet] = await getWallets(createMockProvider());
        ({relayer, provider} = await setupSdk(wallet, '33113'));
        services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
        await services.tokensDetailsStore.fetchTokensDetails();
        services.balanceService.start();
    });

    it('create wallet and disconnect roundtrip', async () => {
        appWrapper = mountWithContext(<App/>, services, ['/']);
        const appPage = new AppPage(appWrapper);
        appPage.login().clickCreateOne();
        appPage.login().approveTerms();
        console.log('before createNew');
        await appPage.login().createNew('super-name');
        console.log('before chooseTopUpMethod');
        appPage.creation().chooseTopUpMethod();
        console.log('before getAddress');
        const address = appPage.creation().getAddress();
        expect(address).to.be.an('string');
        const [wallet] = await getWallets(provider);
        await wallet.sendTransaction({to: address as string, value: utils.parseEther('2.0')});
        console.log('before waitAndGoToWallet');
        await appPage.creation().waitAndGoToWallet();
        console.log('before waitForHomeVIew');
        await appPage.login().waitForHomeView(expectedHomeBalance);
        expect(appWrapper.text().includes(expectedHomeBalance)).to.be.true;
        expect(appWrapper.find('a.button-secondary')).to.have.length(0);
        appPage.dashboard().disconnect();
        expect(appWrapper.text().includes('Welcome in the Jarvis Network')).to.be.true;
    });

    after(async () => {
        services.balanceService.stop();
        appWrapper.unmount();
        await relayer.stop();
    });
});
