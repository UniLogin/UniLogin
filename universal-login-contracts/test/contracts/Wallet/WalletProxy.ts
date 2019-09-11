import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {deployContract, solidity, loadFixture} from 'ethereum-waffle';
import {utils, Contract, Wallet} from 'ethers';
import MockWalletMaster from '../../../build/MockWalletMaster.json';
import UpgradedWallet from '../../../build/UpgradedWallet.json';
import WalletProxy from '../../../build/WalletProxy.json';
import DEFAULT_PAYMENT_OPTIONS from '../../../lib/defaultPaymentOptions';
import basicWalletAndProxy from '../../fixtures/basicWalletAndProxy';

chai.use(chaiAsPromised);
chai.use(solidity);

const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('CONTRACT: WalletProxy', async () => {
  let walletProxy: Contract;
  let proxyAsWallet: Contract;
  let wallet: Wallet;
  let data;

  beforeEach(async () => {
    ({walletProxy, proxyAsWallet, wallet} = await loadFixture(basicWalletAndProxy));
  });


  describe('WalletProxy', async () => {
    it('updates master fails when sender has no permission', async () => {
      const newWallet = await deployContract(wallet, UpgradedWallet);
      data = new utils.Interface(WalletProxy.interface).functions.upgradeTo.encode([newWallet.address]);
      await expect(wallet.sendTransaction({to: walletProxy.address, data, gasPrice, gasLimit})).to.be.revertedWith(`You don't have permission`);
    });

    it('deployment fails if masterCopy is zero', async () => {
      await expect(deployContract(wallet, WalletProxy, [0x0])).to.be.eventually.rejectedWith('invalid address');
    });

    it('should be able to send transaction to wallet', async () => {
      await expect(wallet.sendTransaction({to: proxyAsWallet.address, data: [], gasPrice, gasLimit})).to.be.fulfilled;
    });

    it('should call payable function in MasterCopy', async () => {
      data = new utils.Interface(MockWalletMaster.interface).functions.giveAway.encode([]);
      await wallet.sendTransaction({to: walletProxy.address, data, gasPrice, gasLimit});
    });

    it('should call function in MasterCopy', async () => {
      data = new utils.Interface(MockWalletMaster.interface).functions.increase.encode([]);
      const countBefore = await proxyAsWallet.count();
      await wallet.sendTransaction({to: walletProxy.address, data, gasPrice, gasLimit});
      const countAfter = await proxyAsWallet.count();
      expect(countAfter - countBefore).to.be.equal(1);
    });
  });
});
