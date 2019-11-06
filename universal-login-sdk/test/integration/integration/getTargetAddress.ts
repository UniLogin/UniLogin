import {expect} from 'chai';
import {Wallet} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import {RelayerUnderTest} from '@universal-login/relayer';
import UniversalLoginSDK from '../../../lib';
import {getTargetAddress} from '../../../lib/core/utils/getTargetAddress';
import {setupSdk, createWallet} from '../../helpers';

describe('getTargetAddress', () => {
  let sdk: UniversalLoginSDK;
  let relayer: RelayerUnderTest;
  let wallet: Wallet;

  before(async () => {
    [wallet] = getWallets(createMockProvider());
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
