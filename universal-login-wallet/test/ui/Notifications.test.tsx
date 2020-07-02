import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {Contract} from 'ethers';
import {createFixtureLoader, MockProvider} from 'ethereum-waffle';
import {deployMockToken} from '@unilogin/commons/testutils';
import {Services} from '../../src/ui/createServices';
import {AppPage} from '../pages/AppPage';
import {setupUI} from '../testhelpers/setupUI';
import {waitExpect} from '@unilogin/commons/testutils';
import {RelayerUnderTest} from '@unilogin/relayer';

describe('UI: Notifications', () => {
  let services: Services;
  let relayer: any;
  let appWrapper: ReactWrapper;
  let appPage: AppPage;
  let mockTokenContract: Contract;

  beforeEach(async () => {
    const provider = new MockProvider();
    const [wallet] = provider.getWallets();
    ({relayer} = await RelayerUnderTest.createPreconfigured(wallet, '33113'));
    await relayer.start();
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, wallet, mockTokenContract.address));
  });

  it('Should get notification when new device connect and confirm request', async () => {
    expect(appPage.dashboard().isNotificationAlert()).to.be.false;
    const {securityCode} = await services.sdk.connect(services.walletService.getDeployedWallet().contractAddress);
    await appPage.dashboard().waitForNewNotifications();
    expect(appPage.dashboard().isNotificationAlert()).to.be.true;
    await appPage.dashboard().clickDevicesButton();
    await appPage.dashboard().clickManageDevicesButton();
    await appPage.notifications().inputSecurityCode(securityCode);
    appPage.notifications().selectGasMode();
    await appPage.notifications().clickConnectDeviceButton();
    await waitExpect(() => expect(appPage.notifications().isNotificationAlert()).to.be.false, 2000);
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
