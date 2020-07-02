import {expect} from 'chai';
import {Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import UniLoginSdk from '../../../src';
import {getTargetAddress} from '../../../src/core/utils/getTargetAddress';
import {setupSdk, createWallet} from '../../helpers';

describe('getTargetAddress', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;

  before(async () => {
    [wallet] = new MockProvider().getWallets();
    ({sdk, relayer} = await setupSdk(wallet));
  });

  it('returns address for address', async () => {
    expect(await getTargetAddress(sdk, TEST_ACCOUNT_ADDRESS)).to.eq(TEST_ACCOUNT_ADDRESS);
  });

  it('returns address for ens name', async () => {
    const ensName = 'existing.mylogin.eth';
    const {contractAddress} = await createWallet(ensName, sdk, wallet);
    expect(await getTargetAddress(sdk, ensName)).to.eq(contractAddress);
  });

  it('returns address for ens name', async () => {
    const ensName = 'not-existing.mylogin.eth';
    await expect(getTargetAddress(sdk, ensName)).to.be.rejectedWith(`${ensName} is not valid`);
  });

  after(async () => {
    await relayer.stop();
  });
});
