import 'jsdom-global/register';
import React from 'react';
import {expect} from 'chai';
import App from '../../src/ui/App';
import {ReactWrapper} from 'enzyme';
import {providers, utils, Contract} from 'ethers';
import {createFixtureLoader} from 'ethereum-waffle';
import {setupSdk} from 'universal-login-sdk/test';
import {Services} from '../../src/services/Services';
import ServicesUnderTest from '../helpers/ServicesUnderTests';
import {sleep} from 'universal-login-commons';
import {mountWithContext} from '../helpers/CustomMount';
import {deployMockToken} from 'universal-login-commons/test';
import { AppPage } from '../../../node_modules/universal-login-wallet/test/pages/AppPage';

describe('UI: Transfer', () => {
  let appWrapper: ReactWrapper;
  let services: Services;
  let relayer: any;
  let provider: providers.Web3Provider;
  let mockTokenContract: Contract;
  const amount = '1';
  const receiverAddress = '0x0000000000000000000000000000000000000001';

  before(async () => {
    ({relayer, provider} = await setupSdk());
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    services = await ServicesUnderTest.createPreconfigured(provider, relayer, [mockTokenContract.address]);
    services.tokenService.start();
  });

  it('Creates wallet and transfers tokens', async () => {
    appWrapper = mountWithContext(<App/>, services, ['/', '/login']);
    const appPage = new AppPage(appWrapper)
    await appPage.login().pickUsername('super-name');


    const walletAddress = services.walletService.userWallet ? services.walletService.userWallet.contractAddress : '0x0';
    mockTokenContract.transfer(walletAddress, utils.parseEther('2.0'));

    appPage.dashboard().clickTransferButton();
    appPage.transfer().enterTransferDetails(receiverAddress, '1');

    await sleep(300);
    expect(await mockTokenContract.balanceOf(receiverAddress)).to.deep.eq(utils.parseEther(amount));
  });

  after(() => {
    appWrapper.unmount();
    relayer.stop();
  });
});
