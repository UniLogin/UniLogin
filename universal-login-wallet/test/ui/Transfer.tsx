import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import App from '../../src/ui/App';
import {ReactWrapper} from 'enzyme';
import {providers, utils, Contract, Wallet} from 'ethers';
import {createFixtureLoader, getWallets} from 'ethereum-waffle';
import {setupSdk} from 'universal-login-sdk/test';
import {Services} from '../../src/services/Services';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {mountWithContext} from '../helpers/CustomMount';
import {deployMockToken} from 'universal-login-commons/test';
import {AppPage} from '../pages/AppPage';

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let provider: providers.Web3Provider;
  let mockTokenContract: Contract;
  let wallet: Wallet;
  const receiverAddress = '0x0000000000000000000000000000000000000001';

  before(async () => {
    ({relayer, provider} = await setupSdk({overridePort: 33113}));
    [wallet] = await getWallets(provider);
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [mockTokenContract.address]);
    services.tokenService.start();
    services.balanceService.start();
  });

  it('Creates wallet and transfers tokens', async () => {
    appWrapper = mountWithContext(<App/>, services, ['/', '/login']);
    const appPage = new AppPage(appWrapper);
    await appPage.login().createNew('super-name');

    const walletAddress = services.walletService.userWallet ? services.walletService.userWallet.contractAddress : '0x0';
    await mockTokenContract.transfer(walletAddress, utils.parseEther('2.0'));

    const address = appPage.login().getAddress();
    await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
    await appPage.login().waitForHomeView('2.0');
    appPage.dashboard().clickTransferButton();
    appPage.transfer().enterTransferDetails(receiverAddress, '1');

    const tokenBalance = await appPage.dashboard().getBalance(mockTokenContract, walletAddress);
    expect(tokenBalance).to.eq('999947384000000000');
  });

  after(async () => {
    services.balanceService.stop();
    appWrapper.unmount();
    await relayer.stop();
  });
});
