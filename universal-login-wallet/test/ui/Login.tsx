import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import App from '../../src/ui/App';
import {ReactWrapper} from 'enzyme';
import {providers, Wallet} from 'ethers';
import {getWallets} from 'ethereum-waffle';
import {setupSdk} from '@universal-login/sdk/test';
import {Services} from '../../src/services/Services';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {createAndSendInitial} from '../utils/utils';

describe('UI: Login', () => {
    let appWrapper: ReactWrapper;
    let services: Services;
    let relayer: any;
    let provider: providers.Web3Provider;
    let wallet: Wallet;

    before(async () => {
        ({relayer, provider} = await setupSdk({overridePort: 33113}));
        [wallet] = await getWallets(provider);
        services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
        services.tokenService.start();
        services.balanceService.start();
    });

    it('create wallet and disconnect roundtrip', async () => {
        appWrapper = mountWithContext(<App/>, services, ['/']);
        const appPage = await createAndSendInitial(appWrapper, provider);
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
