import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {RelayerUnderTest} from '@unilogin/relayer';
import {ConfirmedMigratingWallet} from '../../../src/api/wallet/ConfirmedMigratingWallet';
import UniLoginSdk, {DeployedWallet} from '../../../src';
import {setupSdk} from '../../helpers';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';
import {RequestedMigratingWallet} from '../../../src/api/wallet/RequestedMigrating';

describe('INT: ConfirmedMigratingWallet', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let confirmedWallet: ConfirmedMigratingWallet;

  const email = 'account@unilogin.test';
  const ensName = 'account.mylogin.eth';

  beforeEach(async () => {
    const [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
    const {contractAddress, name, privateKey} = await createdDeployedWallet(ensName, sdk, wallet);
    const requestedWallet = new RequestedMigratingWallet(contractAddress, name, privateKey, email, sdk);
    await requestedWallet.requestEmailConfirmation();
    await requestedWallet.confirmEmail(relayer.sentCodes[email]);
    confirmedWallet = new ConfirmedMigratingWallet(contractAddress, name, privateKey, email, relayer.sentCodes[email], sdk);
  });

  it('asSerializableConfirmedMigratingWallet', () => {
    expect(confirmedWallet.asSerializableConfirmedMigratingWallet).deep.eq({
      email,
      ensName,
      privateKey: confirmedWallet.privateKey,
      contractAddress: confirmedWallet.contractAddress,
      code: confirmedWallet.code,
    });
  });

  it('roundtrip', async () => {
    const password = 'SuperStrongNewPassword';
    const result: any = await confirmedWallet.setPassword(password);
    expect(result instanceof DeployedWallet).to.be.true;
  });

  it('deployed wallet functions works', async () => {
    const publicKey = confirmedWallet.publicKey;
    expect(await confirmedWallet.keyExist(publicKey)).to.be.true;
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
