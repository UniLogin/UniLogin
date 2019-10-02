import {expect} from 'chai';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';
import WalletContract from '../../../build/TestableWallet.json';
import {createKeyPair, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

describe('UNIT: WalletContract', () => {
  let walletContract: Contract;

  beforeEach(async () => {
    const [, wallet] = getWallets(createMockProvider());
    walletContract = await deployContract(wallet, WalletContract, [], {gasLimit: 5000000});
    await wallet.sendTransaction({to: walletContract.address, value: utils.parseEther('2')});
    await walletContract.initialize(wallet.address, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN.address);
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
