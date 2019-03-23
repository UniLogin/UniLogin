import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {deployContract, solidity, getWallets, loadFixture} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';
import MockWalletMaster from '../../build/MockWalletMaster';
import Proxy from '../../build/Proxy';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import basicMasterAndProxy from '../fixtures/basicMasterAndProxy';

chai.use(chaiAsPromised);
chai.use(solidity);

const to = '0x0000000000000000000000000000000000000001';
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('CONTRACT: ProxyMasterCopy', async () => {
  let identityMaster;
  let identityProxy;
  let proxyAsIdentity;
  let wallet;
  let data;

  beforeEach(async () => {
    ({identityMaster, identityProxy, proxyAsIdentity, wallet} = await loadFixture(basicMasterAndProxy));
  });

  describe('MasterCopy', async () => {
    it('updateMaster should not be available', async () => {
      expect(identityMaster.updateMaster).to.be.eq(undefined);
    });

    xit('Disabled upgradability: should fail if authorized function is called directly', async () => {
      await expect(identityMaster.updateMaster(to, [], false)).to.be.revertedWith('restricted-access');
    });
  });

  describe('Proxy without MasterCopy', async () => {
    it('should fail if masterCopy is zero', async () => {
      await expect(deployContract(wallet, Proxy, [0x0, []])).to.be.eventually.rejectedWith('invalid address');
    });
  });

  describe('Proxy', async () => {
    it('should be properly constructed', async () => {
			expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
    });

    it('should be able to send transaction to wallet', async () => {
      await expect(wallet.sendTransaction({to: proxyAsIdentity.address, data: [], gasPrice, gasLimit})).to.be.fulfilled;
    });

    it('should call payable function in MasterCopy', async () => {
      data = new utils.Interface(MockWalletMaster.interface).functions.giveAway.encode([]);
      await wallet.sendTransaction({to: identityProxy.address, data, gasPrice, gasLimit});
    });

    it('should call function in MasterCopy', async () => {
      data = new utils.Interface(MockWalletMaster.interface).functions.increase.encode([]);
      const countBefore = await proxyAsIdentity.count();
      await wallet.sendTransaction({to: identityProxy.address, data, gasPrice, gasLimit});
      const countAfter = await proxyAsIdentity.count();
      expect(countAfter - countBefore).to.be.equal(1);
    });
  });
});
