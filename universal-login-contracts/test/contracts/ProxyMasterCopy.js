import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {deployContract, solidity, getWallets, loadFixture} from 'ethereum-waffle';
import {utils} from 'ethers';
import MockMasterCopy from '../../build/MockMasterCopy';
import Proxy from '../../build/Proxy';
import DEFAULT_PAYMENT_OPTIONS from '../../lib/defaultPaymentOptions';
import basicMasterAndProxy from '../fixtures/basicMasterAndProxy';

chai.use(chaiAsPromised);
chai.use(solidity);

const to = '0x0000000000000000000000000000000000000001';
const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('CONTRACT: ProxyMasterCopy', async () => {
  describe('Proxy without MasterCopy', async () => {
    it('should fail if masterCopy is zero', async () => {
      await expect(deployContract(wallet, Proxy, [0x0])).to.be.eventually.rejectedWith('invalid address');
    });
  });

  let provider;
  let masterCopy;
  let proxy;
  let privateKey;
  let publicKey;
  let mockToken;
  let wallet;
  let data;

  beforeEach(async () => {
    ({provider, masterCopy, proxy, privateKey, publicKey, mockToken, wallet} = await loadFixture(basicMasterAndProxy));
  });

  describe('MasterCopy', async () => {
    it('should fail if authorized function is called directly', async () => {
      await expect(masterCopy.changeMasterCopy(to)).to.be.revertedWith('Method can only be called from this contract');
    });
  });

  describe('Proxy', async () => {
    it('should be properly constructed', async () => {
      expect(await proxy.implementation()).to.eq(masterCopy.address);
    });

    it('should fail if function does not exist in MasterCopy', async () => {
      await expect(wallet.sendTransaction({to: proxy.address, data: [], gasPrice, gasLimit})).to.be.reverted;
    });

    it('should call payable function in MasterCopy', async () => {
      data = new utils.Interface(MockMasterCopy.interface).functions.giveAway.encode([]);
      await wallet.sendTransaction({to: proxy.address, data, gasPrice, gasLimit});
    });

    it('should call function in MasterCopy', async () => {
      data = new utils.Interface(MockMasterCopy.interface).functions.increase.encode([]);
      const countBefore = await proxy.count();
      await wallet.sendTransaction({to: proxy.address, data, gasPrice, gasLimit});
      const countAfter = await proxy.count();
      expect(countAfter - countBefore).to.be.equal(1);
    });
  });
});
