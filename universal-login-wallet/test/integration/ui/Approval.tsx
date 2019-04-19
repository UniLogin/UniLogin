import {setupSdk} from '@universal-login/sdk/test';
import {providers, Contract} from 'ethers';
import {Services} from '../../../src/services/Services';
import React from 'react';
import {ReactWrapper} from 'enzyme';
import {expect} from 'chai';
import {AppPage} from '../pages/AppPage';
import {getApp} from '../helpers/setupUI';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer/lib/utils/relayerUnderTest';

describe('UI: Request Approval', async () => {
  let relayer: RelayerUnderTest;
  let provider: providers.Provider;
  let services: Services;
  let appWrapper: ReactWrapper;
  let appPage: AppPage;
  let contractAddress: string;
  const name = 'name.mylogin.eth';

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: '33113'}));
    services = await createPreconfiguredServices(provider, relayer, [ETHER_NATIVE_TOKEN.address]);
    [, contractAddress] = await services.sdk.create(name);
    ({appPage, appWrapper} = await getApp(services));
  });

  it('should reject request', async () => {
    const getPendingAuthorisations = () => services.sdk.fetchPendingAuthorisations(contractAddress);
    expect((await getPendingAuthorisations()).length).to.be.equal(0, 'default list of pending authorisations is not empty');
    await appPage.login().connect(name);
    expect((await getPendingAuthorisations()).length).to.be.equal(1, 'pending authorisation didn\'t added to relayer');
    await appPage.waitingForApproval().clickCancel();
    expect((await getPendingAuthorisations()).length).to.be.equal(0, 'pending authorisation didn\'t remove after click cancel');
    console.log(appWrapper);
  });

  after(async () => {
    await relayer.stop();
    appWrapper.unmount();
  });
});
