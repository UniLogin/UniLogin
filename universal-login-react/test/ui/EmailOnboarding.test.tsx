import React from 'react';
import {expect} from 'chai';
import sinon from 'sinon';
import {ReactWrapper, mount} from 'enzyme';
import {MockProvider} from 'ethereum-waffle';
import {waitUntil} from '@unilogin/commons';
import {waitExpect} from '@unilogin/commons/testutils';
import {setupSdk} from '@unilogin/sdk/testutils';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {EmailFowChooserPage} from '../helpers/pages/EmailFlowChooserPage';
import {Onboarding} from '../../src';

describe('INT: Email Onboarding', () => {
  let reactWrapper: ReactWrapper;
  const onCreateSpy = sinon.spy();
  let sdk: UniLoginSdk;
  let relayer: any;

  before(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({sdk, relayer} = await setupSdk(wallet, '33113'));
    const walletService = new WalletService(sdk);

    reactWrapper = mount(<Onboarding
      walletService={walletService}
      domains={relayer.config.ensRegistrars}
      onCreate={() => onCreateSpy()}
      emailFlow={true}
    />);
  });

  it('onboard with email', async () => {
    const sendConfirmationMailSpy = sinon.spy((relayer as any).emailService, 'sendConfirmationMail');

    const emailFlowChooserPage = new EmailFowChooserPage(reactWrapper);
    emailFlowChooserPage.typeEnsName('user');
    emailFlowChooserPage.typeEmail('user@unilogin.test');
    const codeConfirmationPage = emailFlowChooserPage.confirm();
    expect(codeConfirmationPage.isProperPage()).to.be.true;
    await waitUntil(() => sendConfirmationMailSpy.called);
    const [, code] = sendConfirmationMailSpy.firstCall.args;

    expect(code).to.be.not.undefined;
    expect(code).to.be.string;
    expect(code).length(6);

    const chooseTopUpTokenPage = codeConfirmationPage.confirmCode(code);
    await waitExpect(() => expect(chooseTopUpTokenPage.isProperPage()).to.be.true, 1300);
  });

  after(async () => {
    reactWrapper.unmount();
    await relayer.stop();
  });
});
