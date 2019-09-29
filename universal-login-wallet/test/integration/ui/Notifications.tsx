import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, Contract} from 'ethers';
import {createFixtureLoader, createMockProvider, getWallets} from 'ethereum-waffle';
import {deployMockToken} from '@universal-login/commons/testutils';
import {setupSdk} from '@universal-login/sdk/testutils';
import {Services} from '../../../src/ui/createServices';
import {AppPage} from '../pages/AppPage';
import {setupUI} from '../helpers/setupUI';
import {waitExpect} from '@universal-login/commons';

describe('UI: Notifications',  () => {
  let services : Services;
  let relayer : any;
  let provider : providers.Provider;
  let appWrapper : ReactWrapper;
  let appPage : AppPage;
  let mockTokenContract: Contract;

  beforeEach(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, mockTokenContract.address));
    await services.sdk.start();
  });

  it('Should get notification when new device connect and confirm request', async () => {
    expect(appPage.dashboard().isNotificationAlert()).to.be.false;
    const {securityCode} = await services.sdk.connect(services.walletService.getDeployedWallet().contractAddress);
    await appPage.dashboard().waitForNewNotifications();
    expect(appPage.dashboard().isNotificationAlert()).to.be.true;
    await appPage.dashboard().clickDevicesButton();
    await appPage.dashboard().clickManageDevicesButton();
    await appPage.notifications().inputSecurityCode(securityCode);
    await appPage.notifications().selectGasMode();
    await appPage.notifications().clickConnectDeviceButton();
    expect(appPage.notifications().isNotificationAlert()).to.be.false;
  });

  it('Should reject request', async () => {
    await services.sdk.connect(services.walletService.getDeployedWallet().contractAddress);
    await appPage.dashboard().waitForNewNotifications();
    expect(appPage.notifications().isNotificationAlert()).to.be.true;
    await appPage.dashboard().clickDevicesButton();
    await appPage.dashboard().clickManageDevicesButton();
    await appPage.notifications().clickRejectButton();
    await waitExpect(() => expect(appPage.notifications().isNotificationAlert()).to.be.false);
  });

  afterEach(async () => {
    appWrapper.unmount();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
