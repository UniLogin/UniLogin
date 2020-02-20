import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {deployContract, solidity, loadFixture} from 'ethereum-waffle';
import {Contract, Wallet} from 'ethers';
import {DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT} from '@unilogin/commons';
import WalletProxy from '../../../dist/contracts/WalletProxy.json';
import basicWalletAndProxy from '../../fixtures/basicWalletAndProxy';
import {MockWalletMasterInterface} from '../../helpers/interfaces';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: WalletProxy', async () => {
  let walletProxy: Contract;
  let proxyAsWallet: Contract;
  let wallet: Wallet;
  let data;

  beforeEach(async () => {
    ({walletProxy, proxyAsWallet, wallet} = await loadFixture(basicWalletAndProxy));
  });

  describe('WalletProxy', async () => {
    it('deployment fails if masterCopy is zero', async () => {
      await expect(deployContract(wallet, WalletProxy, [0x0])).to.be.eventually.rejectedWith('invalid address');
    });

    it('should be able to send transaction to wallet', async () => {
      await expect(wallet.sendTransaction({to: proxyAsWallet.address, data: [], gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT})).to.be.fulfilled;
    });

    it('should call payable function in MasterCopy', async () => {
      data = MockWalletMasterInterface.functions.giveAway.encode([]);
      await wallet.sendTransaction({to: walletProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
    });

    it('should call function in MasterCopy', async () => {
      data = MockWalletMasterInterface.functions.increase.encode([]);
      const countBefore = await proxyAsWallet.count();
      await wallet.sendTransaction({to: walletProxy.address, data, gasPrice: DEFAULT_GAS_PRICE, gasLimit: DEFAULT_GAS_LIMIT});
      const countAfter = await proxyAsWallet.count();
      expect(countAfter - countBefore).to.eq(1);
    });
  });
});
