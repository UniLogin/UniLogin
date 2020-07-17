import {expect} from 'chai'; ;
import sinon from 'sinon';
import {MockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {RequestedWallet} from '../../../src/api/wallet/RequestedWallet';
import UniLoginSdk from '../../../src';
import {setupSdk} from '../../helpers';

describe('INT: RequestedWallet', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let requestedWallet: RequestedWallet;

  const email = 'account@unilogin.test';
  const ensName = 'account.unilogin.test';

  beforeEach(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
    requestedWallet = new RequestedWallet(sdk, email, ensName);
  });

  it('asSerializableRequestedWallet', () => {
    expect(requestedWallet.asSerializableRequestedWallet).deep.eq({email, ensName});
  });

  it('roundtrip', async () => {
    const sendConfirmationMailSpy = sinon.spy((relayer as any).emailService, 'sendConfirmationMail');
    const requestEmailConfirmationResult = await requestedWallet.requestEmailConfirmation();
    expect(requestEmailConfirmationResult).deep.eq({email});
    const [, code] = sendConfirmationMailSpy.firstCall.args;
    const confirmEmailResult = await requestedWallet.confirmEmail(code);
    expect(confirmEmailResult).deep.eq({email});
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
