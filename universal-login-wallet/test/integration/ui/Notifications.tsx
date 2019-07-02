import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, Contract} from 'ethers';
import {createFixtureLoader, createMockProvider, getWallets} from 'ethereum-waffle';
import {deployMockToken} from '@universal-login/commons/testutils';
import {setupSdk} from '../helpers/setupSdk';
import {Services} from '../../../src/ui/createServices';
import {AppPage} from '../pages/AppPage';
import {setupUI} from '../helpers/setupUI';

describe('UI: Notifications',  () => {
  let services : Services;
  let relayer : any;
  let provider : providers.Provider;
  let appWrapper : ReactWrapper;
  let appPage : AppPage;
  let mockTokenContract: Contract;

  before(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, mockTokenContract.address));
     await services.sdk.start();
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
