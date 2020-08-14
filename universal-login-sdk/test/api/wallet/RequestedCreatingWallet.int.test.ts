import {expect} from 'chai';
import sinon from 'sinon';
import {MockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {RequestedCreatingWallet} from '../../../src/api/wallet/RequestedCreatingWallet';
import UniLoginSdk from '../../../src';
import {setupSdk} from '../../helpers';
import {ConfirmedWallet} from '../../../src/api/wallet/ConfirmedWallet';

describe('INT: RequestedCreatingWallet', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let requestedWallet: RequestedCreatingWallet;

  const email = 'account@unilogin.test';
  const ensName = 'account.unilogin.test';

  beforeEach(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
    requestedWallet = new RequestedCreatingWallet(sdk, email, ensName);
  });

  it('asSerializableRequestedCreatingWallet', () => {
    expect(requestedWallet.asSerializableRequestedCreatingWallet).deep.eq({email, ensName});
  });

  it('roundtrip', async () => {
    const sendConfirmationMailSpy = sinon.spy((relayer as any).emailService, 'sendConfirmationMail');
    const requestEmailConfirmationResult = await requestedWallet.requestEmailConfirmation();
    expect(requestEmailConfirmationResult).deep.eq({email});
    const [, code] = sendConfirmationMailSpy.firstCall.args;
    const confirmEmailResult = await requestedWallet.confirmEmail(code);
    expect(confirmEmailResult).to.be.instanceOf(ConfirmedWallet);
    expect(confirmEmailResult).to.deep.include({email, ensName, code});
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
