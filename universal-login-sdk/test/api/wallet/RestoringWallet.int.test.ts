import {expect} from 'chai';
import {Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {SerializableRestoringWallet, TEST_WALLET, createKeyPair, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, ensure} from '@unilogin/commons';
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
  const email = 'user@unilogin.test';

  beforeEach(async () => {
    [wallet] = new MockProvider().getWallets();
    ({relayer, sdk} = await setupSdk(wallet));
  });

  describe('positive cases', async () => {
    const ensName = 'positive.mylogin.eth';

    beforeEach(async () => {
      await sdk['fetchFutureWalletFactory']();
      sdk['futureWalletFactory']!['getKeyPair'] = () => ({privateKey: TEST_WALLET.privateKey, publicKey: TEST_WALLET.address});
      deployedWallet = await createdDeployedWallet(ensName, sdk, wallet, email);
      restoringWallet = new RestoringWallet(TEST_WALLET.encryptedWallet, email, deployedWallet.name, deployedWallet.contractAddress, ETHER_NATIVE_TOKEN.address, TEST_GAS_PRICE, sdk);
    });

    it('asSerializable returns proper wallet', () => {
      const expectedRestoringWallet: SerializableRestoringWallet = {
        encryptedWallet: TEST_WALLET.encryptedWallet,
        contractAddress: deployedWallet.contractAddress,
        ensName,
        email,
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
      };
      expect(restoringWallet.asSerializableRestoringWallet).to.deep.eq(expectedRestoringWallet);
    });

    it('restore returns deployed wallet', async () => {
      const restoreResult = await restoringWallet.restore(TEST_WALLET.password);
      ensure(restoreResult instanceof DeployedWallet, Error, 'expected DeployedWallet');
      expect(restoreResult.asSerializedDeployedWallet).to.deep.eq(deployedWallet.asSerializedDeployedWallet);
    });
  });

  describe('negative cases', async () => {
    const ensName = 'negative.mylogin.eth';

    beforeEach(async () => {
      await sdk['fetchFutureWalletFactory']();
      sdk['futureWalletFactory']!['getKeyPair'] = createKeyPair;
      deployedWallet = await createdDeployedWallet(ensName, sdk, wallet);
      restoringWallet = new RestoringWallet(TEST_WALLET.encryptedWallet, email, deployedWallet.name, deployedWallet.contractAddress, ETHER_NATIVE_TOKEN.address, TEST_GAS_PRICE, sdk);
    });

    it('throw error if key is not owner', async () => {
      await expect(restoringWallet.restore(TEST_WALLET.password)).to.be.rejectedWith(`Private key is not contract's ${deployedWallet.contractAddress} owner`);
    });

    it('invalid password', async () => {
      await expect(restoringWallet.restore('whaaaaat')).to.be.rejectedWith('invalid password');
    });
  });

  afterEach(async () => {
    await relayer.stop();
  });
});
