import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, utils, Contract} from 'ethers';
import {createFixtureLoader, getWallets, createMockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {deployMockToken} from '@universal-login/commons/testutils';
import {setupSdk} from '@universal-login/sdk/testutils';
import {Services} from '../../../src/ui/createServices';
import {setupUI} from '../helpers/setupUI';
import {setupCryptoCompare} from '../helpers/setupCryptoCompare';
import {AppPage} from '../pages/AppPage';

setupCryptoCompare();

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let appPage: AppPage;
  let provider: providers.Provider;
  let mockTokenContract: Contract;
  const receiverAddress = TEST_ACCOUNT_ADDRESS;

  beforeEach(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, mockTokenContract.address));
    const walletAddress = services.walletService.state.kind === 'Deployed' ? services.walletService.getDeployedWallet().contractAddress : '0x0';
    await mockTokenContract.transfer(walletAddress, utils.parseEther('2.0'));
  });

  it('Creates wallet and transfers ethers', async () => {
    appPage.dashboard().clickTransferButton();
    await appPage.transfer().chooseCurrency('ETH');
    appPage.transfer().enterTransferAmount('1');
    appPage.transfer().enterRecipient(receiverAddress);
    appPage.transfer().transfer();
    await appPage.dashboard().waitForHideModal();
    expect(appPage.dashboard().getWalletBalance()).to.match(/^\$0\.9{2}[0-9]{6}/);
  });

  it('Creates wallet and transfers max amount of ethers', async () => {
    appPage.dashboard().clickTransferButton();
    await appPage.transfer().chooseCurrency('ETH');
    appPage.transfer().clickMaxAmountButton();
    appPage.transfer().clickSelectRecipient();
    appPage.transfer().enterRecipient(receiverAddress);
    appPage.transfer().transfer();
    await appPage.dashboard().waitForHideModal();
    const amountLeft = appPage.dashboard().getWalletBalance().replace('$', '');
    expect(Number(amountLeft)).to.be.lt(0.000004);
  });

  afterEach(async () => {
    appWrapper.unmount();
    await relayer.stop();
  });
});
