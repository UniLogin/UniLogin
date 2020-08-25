import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {ReactWrapper, mount} from 'enzyme';
import {MockProvider} from 'ethereum-waffle';
import {waitUntil, TEST_PASSWORD} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {setupSdk} from '@unilogin/sdk/testutils';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {EmailFowChooserPage} from '../helpers/pages/EmailFlowChooserPage';
import {Onboarding} from '../../src';
import {utils, Wallet} from 'ethers';

describe('INT: Email Onboarding', () => {
  let sdk: UniLoginSdk;
  let reactWrapper: ReactWrapper;
  let relayer: any;
  let wallet: Wallet;
  let walletService: WalletService;

  const onCreateSpy = sinon.spy();

  before(async () => {
    [wallet] = new MockProvider().getWallets();
    ({sdk, relayer} = await setupSdk(wallet, '33113'));
    walletService = new WalletService(sdk);
    await sdk.start();

    reactWrapper = mount(<Onboarding
      walletService={walletService}
      domains={relayer.config.ensRegistrars}
      onCreate={() => onCreateSpy()}
      emailFlow={true}
    />);
  });

  it('onboard with email', async () => {
    const email = 'user@unilogin.test';
    const emailFlowChooserPage = new EmailFowChooserPage(reactWrapper);
    emailFlowChooserPage.typeEnsName('user');
    emailFlowChooserPage.typeEmail(email);
    const codeConfirmationPage = emailFlowChooserPage.confirm();
    expect(codeConfirmationPage.isProperPage()).to.be.true;
    await waitUntil(() => !!relayer.sentCodes[email]);

    const createPasswordPage = codeConfirmationPage.confirmCode(relayer.sentCodes[email]);
    await waitExpect(() => expect(createPasswordPage.isProperPage()).to.be.true, 1300);
    createPasswordPage.enterPassword(TEST_PASSWORD);
    const chooseTopUpTokenPage = createPasswordPage.submit();
    expect(chooseTopUpTokenPage.isProperPage()).to.be.true;
    const topUpPage = chooseTopUpTokenPage.pickTopUpToken();
    await waitExpect(() => expect(topUpPage.isProperPage()).to.be.true, 3000);
    topUpPage.chooseCryptoMethod();
    const address = topUpPage.getAddress();
    expect(walletService.state.kind).eq('Future');
    expect(address).eq(walletService.getFutureWallet().contractAddress);
    const minimalAmount = walletService.getRequiredDeploymentBalance();
    await wallet.sendTransaction({
      to: walletService.getFutureWallet().contractAddress,
      value: utils.parseEther(minimalAmount),
    });
    await waitExpect(() => expect(walletService.state.kind).eq('Deploying'));
    await waitExpect(() => expect(walletService.state.kind).eq('Deployed'));
  });

  after(async () => {
    reactWrapper.unmount();
    await sdk.finalizeAndStop();
    await relayer.stop();
  });
});
