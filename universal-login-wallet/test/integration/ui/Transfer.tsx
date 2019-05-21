import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {providers, utils, Contract} from 'ethers';
import {createFixtureLoader, getWallets, createMockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {deployMockToken} from '@universal-login/commons/test';
import {Services} from '../../../src/services/Services';
import {setupSdk} from '../helpers/setupSdk';
import {setupUI} from '../helpers/setupUI';
import {AppPage} from '../pages/AppPage';

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let appPage: AppPage;
  let provider: providers.Provider;
  let mockTokenContract: Contract;
  const receiverAddress = TEST_ACCOUNT_ADDRESS;

  before(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, mockTokenContract.address));
  });

  it('Creates wallet and transfers tokens', async () => {
    const walletAddress = services.walletService.userWallet ? services.walletService.userWallet.contractAddress : '0x0';
    await mockTokenContract.transfer(walletAddress, utils.parseEther('2.0'));

    appPage.dashboard().clickTransferButton();
    appPage.transfer().enterTransferDetails(receiverAddress, '1');

    const tokenBalance = await appPage.dashboard().getBalance(mockTokenContract, walletAddress);
    expect(tokenBalance).to.eq('999967821000000000');
  });

  after(async () => {
    services.balanceService.stop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
