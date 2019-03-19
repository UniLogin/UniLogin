import chai, {expect} from 'chai';
import {EtherBalanceService} from '../src/services/balance/EtherBalanceService';
import {createMockProvider, solidity, getWallets} from 'ethereum-waffle';
import {utils} from 'ethers';
import {BalanceService} from '../src/services/balance/BalanceService';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {waitUntil} from 'universal-login-commons';

chai.use(solidity);
chai.use(sinonChai);

describe('Balance', () => {
  describe('EtherBalanceService', () => {
    it('should return correct balance', async () => {
      const provider = createMockProvider();
      const walletService = {userWallet: {contractAddress: '0x0000000000000000000000000000000000000001', name: 'name', privateKey: '0x012345'}};
      const etherBalanceService = new EtherBalanceService(provider, walletService);
      
      expect(await etherBalanceService.getBalance()).to.eq(0);
  
      const [wallet] = await getWallets(provider);
      const value = utils.parseEther('1');
      await wallet.sendTransaction({to: walletService.userWallet.contractAddress, value});
      expect(await etherBalanceService.getBalance()).to.eq(value);
    });
  });
  
  describe('BalanceService', () => {
    it('should call callback with correct parameters', async () => {
      const callback = sinon.spy();
      const provider = createMockProvider();
      const walletService = {userWallet: {contractAddress: '0x0000000000000000000000000000000000000001', name: 'name', privateKey: '0x012345'}};
      const etherBalanceService = new EtherBalanceService(provider, walletService);
      const balanceService = new BalanceService(etherBalanceService);
      const unsubscribe = await balanceService.subscribeBalance(callback);
      await waitUntil(() => !!callback.firstCall);
      expect(callback).to.have.been.calledOnce;
      expect(callback.getCall(0).args[0]).to.eq(0);
      const [wallet] = await getWallets(provider);
      const value = utils.parseEther('1');
      await wallet.sendTransaction({to: walletService.userWallet.contractAddress, value});
      await waitUntil(() => !!callback.secondCall);
      expect(callback).to.have.been.calledTwice;
      expect(callback.getCall(1).args[0]).to.eq(value);
      unsubscribe();
    });
  });
});