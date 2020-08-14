import {expect} from 'chai';
import {Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {SerializableRestoringWallet, TEST_WALLET, createKeyPair} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import {RestoringWallet} from '../../../src/api/wallet/RestoringWallet';
import UniLoginSdk, {DeployedWallet} from '../../../src';
import {setupSdk} from '../../helpers';
import {createdDeployedWallet} from '../../helpers/createDeployedWallet';

describe('INT: RestoringWallet', () => {
  let sdk: UniLoginSdk;
  let relayer: RelayerUnderTest;
  let restoringWallet: RestoringWallet;
  let deployedWallet: DeployedWallet;
  let wallet: Wallet;

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
  });

  describe('positive cases', async () => {
    const ensName = 'positive.mylogin.eth';

    beforeEach(async () => {
      await sdk['fetchFutureWalletFactory']();
      sdk['futureWalletFactory']!['getKeyPair'] = () => ({privateKey: TEST_WALLET.privateKey, publicKey: TEST_WALLET.address});
      deployedWallet = await createdDeployedWallet(ensName, sdk, wallet);
      restoringWallet = new RestoringWallet(TEST_WALLET.encryptedWallet, deployedWallet.name, deployedWallet.contractAddress, sdk);
    });

    it('asSerializable returns proper wallet', () => {
      const expectedRestoringWallet: SerializableRestoringWallet = {
        encryptedWallet: TEST_WALLET.encryptedWallet,
        contractAddress: deployedWallet.contractAddress,
        ensName,
      };
      expect(restoringWallet.asSerializableRestoringWallet).to.deep.eq(expectedRestoringWallet);
    });

    it('restore returns deployed wallet', async () => {
      const restoreResult = await restoringWallet.restore(TEST_WALLET.password);
      expect(restoreResult.asApplicationWallet).to.deep.eq(deployedWallet.asApplicationWallet);
    });
  });

  describe('negative cases', async () => {
    const ensName = 'negative.mylogin.eth';

    beforeEach(async () => {
      await sdk['fetchFutureWalletFactory']();
      sdk['futureWalletFactory']!['getKeyPair'] = createKeyPair;
      deployedWallet = await createdDeployedWallet(ensName, sdk, wallet);
      restoringWallet = new RestoringWallet(TEST_WALLET.encryptedWallet, deployedWallet.name, deployedWallet.contractAddress, sdk);
    });

    it('throw error if key is not owner', async () => {
      await expect(restoringWallet.restore(TEST_WALLET.password)).to.be.rejectedWith('Invalid password');
    });

    it('invalid password', async () => {
      await expect(restoringWallet.restore('whaaaaat')).to.be.rejectedWith('Invalid password');
    });
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
