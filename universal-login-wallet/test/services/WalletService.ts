import WalletService from '../../src/services/WalletService';
import {expect} from 'chai';

describe('WalletService', () => {
    it('should disconnect', () => {
       const userWallet =  {name: 'justyna.nylogin.eth', contractAddress: '0x123', privateKey: '0x5422' };
       const walletService = new WalletService();
       walletService.userWallet = userWallet;
       expect(walletService.userWallet).to.deep.eq(userWallet);
       walletService.disconnect();
       expect(walletService.userWallet).to.be.null;
    });
});
