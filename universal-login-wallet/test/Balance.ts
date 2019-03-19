import chai, {expect} from 'chai';
import {EtherBalanceService} from '../src/services/balance/EtherBalanceService';
import {createMockProvider, solidity, getWallets} from 'ethereum-waffle';
import {utils} from 'ethers';
import {BalanceService} from '../src/services/balance/BalanceService';

chai.use(solidity);

describe('Balance', () => {
  describe('EtherBalanceService', () => {
    it('should return correct balance', async () => {
      const provider = createMockProvider();
      const userWallet = {contractAddress: '0x0000000000000000000000000000000000000001'};
      const etherBalanceService = new EtherBalanceService(provider, userWallet);
      
      expect(await etherBalanceService.getBalance()).to.eq(0);
  
      const [wallet] = await getWallets(provider);
      const value = utils.parseEther('1');
      await wallet.sendTransaction({to: userWallet.contractAddress, value});
      expect(await etherBalanceService.getBalance()).to.eq(value);
    });
  })

});