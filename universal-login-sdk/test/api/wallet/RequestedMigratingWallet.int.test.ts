import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {RequestedMigratingWallet} from '../../../src/api/wallet/RequestedMigrating';
import UniLoginSdk from '../../../src';
import {setupSdk} from '../../helpers';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';

describe('INT: RequestedMigratingWallet', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let requestedWallet: RequestedMigratingWallet;

  const email = 'account@unilogin.test';
  const ensName = 'account.mylogin.eth';

  beforeEach(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
    const {contractAddress, name, privateKey} = await createdDeployedWallet(ensName, sdk, wallet);
    requestedWallet = new RequestedMigratingWallet(contractAddress, name, privateKey, email, sdk);
  });

  it('asSerializableRequestedMigratingWallet', () => {
    expect(requestedWallet.asSerializableRequestedMigratingWallet).deep.eq({
      email,
      ensName,
      privateKey: requestedWallet.privateKey,
      contractAddress: requestedWallet.contractAddress
    });
  });

  it('roundtrip', async () => {
    const requestEmailConfirmationResult = await requestedWallet.requestEmailConfirmation();
    expect(requestEmailConfirmationResult).deep.eq({email});
    const confirmEmailResult = await requestedWallet.confirmEmail(relayer.sentCodes[email]);
    expect(confirmEmailResult).to.eq(email);
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
