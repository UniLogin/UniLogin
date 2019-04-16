import React from 'react';
import {ReactWrapper} from 'enzyme';
import {expect} from 'chai';
import App from '../../../src/ui/App';
import {Services} from '../../../src/services/Services';
import {providers, utils} from 'ethers';
import {setupSdk} from '@universal-login/sdk/test';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {ETHER_NATIVE_TOKEN, waitUntil} from '@universal-login/commons';
import {mountWithContext} from '../helpers/CustomMount';
import {createAndSendInitial} from '../helpers/utils';
import {AppPage} from '../pages/AppPage';

describe('UI: Notifications',  () => {
  let services : Services;
  let relayer : any;
  let provider : providers.Provider;
  let appWrapper : ReactWrapper;
  let appPage : AppPage;

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: '33113'}));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    await services.tokenService.start();
    services.balanceService.start();
    await services.sdk.start();
    appWrapper = mountWithContext(<App/>, services, ['/']);

    appPage = await createAndSendInitial(appWrapper, provider);
  });

  it('Should get notification when new device connect and confirm request', async () => {
    expect(appPage.dashboard().isNotificationAlert()).to.be.false;

    await services.sdk.connect(services.walletService.userWallet!.contractAddress);
    await appPage.dashboard().waitForNewNotifications();

    expect(appPage.dashboard().isNotificationAlert()).to.be.true;

    await appPage.dashboard().clickNotificationButton();
    await appPage.notifications().clickConfirmButton();

    expect(appPage.notifications().isNotificationAlert()).to.be.false;
  });

  it('Should reject request', async () => {
    await services.sdk.connect(services.walletService.userWallet!.contractAddress);
    await appPage.dashboard().waitForNewNotifications();
    await appPage.dashboard().clickNotificationButton();
    await appPage.notifications().clickRejectButton();

    expect(appPage.notifications().isNotificationAlert()).to.be.false;
  });

  after(async () => {
    appWrapper.unmount();
    services.balanceService.stop();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });

});
