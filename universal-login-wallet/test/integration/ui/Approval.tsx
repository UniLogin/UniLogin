import {setupSdk} from '@universal-login/sdk/test';
import {providers, Contract} from 'ethers';
import {Services} from '../../../src/services/Services';
import {createPreconfiguredServices} from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import App from '../../../src/ui/App';
import React from 'react';
import {ReactWrapper} from 'enzyme';
import {AppPage} from '../pages/AppPage';
import { createFixtureLoader } from 'ethereum-waffle';
import { deployMockToken } from '@universal-login/commons/test';
import { setupUI } from '../helpers/setupUI';

describe('UI: Request Approval', async () => {
  let relayer: any;
  let provider: providers.Provider;
  let services: Services;
  let appWrapper: ReactWrapper;
  let appPage: AppPage;
  let mockTokenContract: Contract;
  const name = 'name.mylogin.eth';

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: '33113'}));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    ({appPage, appWrapper, services} = await setupUI(relayer, mockTokenContract.address));
    await services.sdk.start();
  });

  it('should reject request', async () => {
    const [privateKey, contractAddress] = await services.sdk.create(name);
    await appPage.login().pickUsername('super-name', 'create new', 'Transfer one of following');
    // await appPage.waitingForApproval().clickCancel();
    // const [wallet] = await getWallets(provider);
    // await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
  });

  after(async () => {
    appWrapper.unmount();
    services.balanceService.stop();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
