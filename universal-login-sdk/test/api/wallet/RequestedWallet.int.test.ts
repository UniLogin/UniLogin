import {expect} from 'chai';
import {RequestedWallet} from '../../../src/api/wallet/RequestedWallet';
import UniLoginSdk from '../../../src';
import {setupSdk} from '../../helpers';
import {MockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';

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

  it('requestEmailConfirmation', async () => {
    const result = await requestedWallet.requestEmailConfirmation();
    expect(result).deep.eq({email});
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
