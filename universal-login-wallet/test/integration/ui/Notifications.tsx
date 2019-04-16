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

describe('UI: Notifications',  () => {
  let services : Services;
  let relayer : any;
  let provider : providers.Provider;
  let appWrapper : ReactWrapper;

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: '33113'}));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    await services.tokenService.start();
    services.balanceService.start();
    await services.sdk.start();
    appWrapper = mountWithContext(<App/>, services, ['/']);
  });

  it('Should get notification when new device connect', async () => {
    const appPage = await createAndSendInitial(appWrapper, provider);

    expect(appPage.dashboard().isNotificationAlert()).to.be.false;

    await services.sdk.connect(services.walletService.userWallet!.contractAddress);
    await appPage.dashboard().waitForNewNotifications();

    expect(appPage.dashboard().isNotificationAlert()).to.be.true;

    await appPage.dashboard().clickNotificationButton();
    await appPage.notifications().clickConfirmButton();

    expect(appPage.notifications().isNotificationAlert()).to.be.false;
  });

  after(async () => {
    appWrapper.unmount();
    services.balanceService.stop();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });

});
