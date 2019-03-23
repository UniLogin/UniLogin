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

describe('ProxyMasterCopy', async () => {
  describe('Proxy without MasterCopy', async () => {
    it('should fail if masterCopy is zero', async () => {
      await expect(deployContract(wallet, Proxy, [0x0, []])).to.be.eventually.rejectedWith('invalid address');
    });
  });

  let provider;
  let identityMaster;
  let identityProxy;
  let proxyAsIdentity;
  let privateKey;
  let publicKey;
  let mockToken;
  let wallet;
  let data;

  beforeEach(async () => {
    ({provider, identityMaster, identityProxy, proxyAsIdentity, privateKey, publicKey, mockToken, wallet} = await loadFixture(basicMasterAndProxy));
  });

  describe('MasterCopy', async () => {
    it('should fail if authorized function is called directly', async () => {
      await expect(identityMaster.updateMaster(to, [])).to.be.revertedWith('restricted-access');
    });
  });

  describe('Proxy', async () => {
    it('should be properly constructed', async () => {
			expect(await proxyAsIdentity.master()).to.eq(identityMaster.address);
    });

    // catched by callback. Otherwize you cannot transfer value to a proxy.
    // it('should fail if function does not exist in MasterCopy', async () => {
    //   await expect(wallet.sendTransaction({to: proxy.address, data: [], gasPrice, gasLimit})).to.be.reverted;
    // });

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
