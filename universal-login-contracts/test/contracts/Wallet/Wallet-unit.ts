import {expect} from 'chai';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {Wallet, Contract} from 'ethers';
import WalletContract from '../../../build/TestableWallet.json';
import {createKeyPair} from '@universal-login/commons';

describe('UNIT: WalletContract', () => {
  let walletContract: Contract;
  let wallet: Wallet;

  beforeEach(async () => {
    [wallet] = getWallets(createMockProvider());
    walletContract = await deployContract(wallet, WalletContract, []);
    await walletContract.initialize(wallet.address);
  });

  describe('setRequiredSignatures', async () => {
    it('change the number of required signatures successfully', async () => {
      await walletContract.addKey(createKeyPair().publicKey);
      await walletContract.setRequiredSignatures(2);
      expect(await walletContract.requiredSignatures()).to.eq(2);
    });

    it('fail to change the amount of required signatures if the amount is equal to the actual amount', async () => {
      await expect(walletContract.setRequiredSignatures(1)).to.be.revertedWith('Invalid required signature');
    });

    it('fail to change the amount of required signatures if the new amount 0', async () => {
      await expect(walletContract.setRequiredSignatures(0)).to.be.revertedWith('Invalid required signature');
    });

    it('fail to change the amount of required signatures if the new amount is higher than keyCount', async () => {
      await expect(walletContract.setRequiredSignatures(await walletContract.keyCount() + 1)).to.be.revertedWith('Signatures exceed owned keys number');
    });
  });
});
