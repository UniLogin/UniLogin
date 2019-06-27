import {expect} from 'chai';
import UniversalLoginSDK from '@universal-login/sdk';
import WalletService, {UserWallet} from '../../../src/services/WalletService';

describe('WalletService', () => {
    const userWallet: UserWallet =  {name: 'justyna.nylogin.eth', contractAddress: '0x123', privateKey: '0x5422' };
    const walletService = new WalletService({} as UniversalLoginSDK);

    it('should disconnect', () => {
       walletService.userWallet = userWallet;
       expect(walletService.userWallet).to.deep.eq(userWallet);
       walletService.disconnect();
       expect(walletService.userWallet).to.be.null;
    });

    it('should set state and userWallet', () => {
        walletService.setUserWallet(userWallet);
        expect(walletService.userWallet).to.deep.eq(userWallet);
        expect(walletService.state).to.be.eq('Deployed');
    });
});
