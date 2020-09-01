import {expect} from 'chai';
import {ReactWrapper} from 'enzyme';
import {utils, Contract} from 'ethers';
import {createFixtureLoader, MockProvider} from 'ethereum-waffle';
import {waitExpect} from '@unilogin/commons/testutils';
import {deployMockToken} from '@unilogin/commons/testutils';
import {WalletService} from '@unilogin/sdk';
import {setupSdk, createAndSetWallet} from '@unilogin/sdk/testutils';
import {Services} from '../../src/ui/createServices';
import {setupUI} from '../testhelpers/setupUI';
import {AppPage} from '../pages/AppPage';

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let appPage: AppPage;
  let provider: MockProvider;
  let mockTokenContract: Contract;
  let receiverAddress: string;
  const receiverEnsName = 'receiver.mylogin.eth';
  let initialReceiverEthBalance: utils.BigNumber;
  let senderAddress: string;

  const transferFlow = async (
    appPage: AppPage,
    symbol: string,
    amount: string,
    receiver: string,
  ) => {
    appPage.dashboard().goToTransferPage();
    await appPage.transfer().waitForBalance();
    await appPage.transfer().chooseCurrency(symbol);
    appPage.transfer().enterTransferAmount(amount);
    appPage.transfer().enterRecipient(receiver);
    await appPage.transfer().waitForGasMode();
    appPage.transfer().selectGasMode();
    appPage.transfer().transfer();
    return appPage.transfer();
  };

  beforeEach(async () => {
    provider = new MockProvider();
    const [wallet] = provider.getWallets();
    ({relayer} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    ({appWrapper, appPage, services} = await setupUI(relayer, wallet, mockTokenContract.address));
    ({contractAddress: receiverAddress} = await createAndSetWallet(receiverEnsName, new WalletService(services.sdk), wallet, services.sdk));
    initialReceiverEthBalance = await provider.getBalance(receiverAddress);
    senderAddress = services.walletService.state.kind === 'DeployedWithoutEmail'
      ? services.walletService.getDeployedWallet().contractAddress
      : '0x0';
  });

  it('send ETH => proper contractAddress', async () => {
    await transferFlow(appPage, 'ETH', '1', receiverAddress);
    await appPage.dashboard().waitForHideModal();
    await appPage.dashboard().waitForBalanceUpdate('$1.98');
    expect(appPage.dashboard().getWalletBalance()).to.eq('$0.98');
    expect((await provider.getBalance(receiverAddress)).toString())
      .to.eq(initialReceiverEthBalance.add(utils.parseEther('1')));
  });

  it('ETH => proper ensName', async () => {
    await transferFlow(appPage, 'ETH', '1', receiverEnsName);
    await appPage.dashboard().waitForHideModal();
    await appPage.dashboard().waitForBalanceUpdate('$1.98');
    expect(appPage.dashboard().getWalletBalance()).to.eq('$0.98');
    expect((await provider.getBalance(receiverAddress)).toString())
      .to.eq(initialReceiverEthBalance.add(utils.parseEther('1')));
  });

  it('token => proper contractAddress', async () => {
    await mockTokenContract.transfer(senderAddress, utils.parseEther('2.0'));
    await waitExpect(async () => {
      expect((await mockTokenContract.balanceOf(senderAddress)).toString())
        .to.eq(utils.parseEther('2'));
      expect(appPage.dashboard().getWalletBalance()).to.eq('$3.98');
    });
    await transferFlow(appPage, 'DAI', '1', receiverAddress);
    await appPage.dashboard().waitForHideModal();
    await appPage.dashboard().waitForBalanceUpdate('$3.98');
    expect(appPage.dashboard().getWalletBalance()).to.eq('$2.98');
    expect((await mockTokenContract.balanceOf(receiverAddress)).toString())
      .to.eq(utils.parseEther('1'));
  });

  it('token => proper ensName', async () => {
    await mockTokenContract.transfer(senderAddress, utils.parseEther('2.0'));
    await waitExpect(async () => {
      expect((await mockTokenContract.balanceOf(senderAddress)).toString())
        .to.eq(utils.parseEther('2'));
      expect(appPage.dashboard().getWalletBalance()).to.eq('$3.98');
    });
    await transferFlow(appPage, 'DAI', '1', receiverEnsName);
    await appPage.dashboard().waitForHideModal();
    await appPage.dashboard().waitForBalanceUpdate('$3.98');
    expect(appPage.dashboard().getWalletBalance()).to.eq('$2.98');
    expect((await mockTokenContract.balanceOf(receiverAddress)).toString())
      .to.eq(utils.parseEther('1'));
  });

  it('Shows error if invalid amount', async () => {
    await transferFlow(appPage, 'ETH', '10', receiverEnsName);
    expect(await appPage.transfer().doesAmountErrorExists()).to.be.true;
  });

  it('Shows error if invalid recipient address', async () => {
    await transferFlow(appPage, 'ETH', '1', '0x123');
    expect(await appPage.transfer().doesRecipientErrorExists()).to.be.true;
  });

  it('Shows error if invalid recipient ens name', async () => {
    await transferFlow(appPage, 'ETH', '1', 'test');
    expect(await appPage.transfer().doesRecipientErrorExists()).to.be.true;
  });

  it('Shows errors if invalid amount and recipient', async () => {
    await transferFlow(appPage, 'ETH', '10', '0x123');
    expect(await appPage.transfer().doesAmountErrorExists()).to.be.true;
    expect(await appPage.transfer().doesRecipientErrorExists()).to.be.true;
  });

  afterEach(async () => {
    appWrapper.unmount();
    await services.sdk.finalizeAndStop();
    await relayer.stop();
  });
});
