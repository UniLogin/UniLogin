import {DeployedWallet} from '../../../lib';
import {utils, Wallet} from 'ethers';
import {expect} from 'chai';

describe('DeployedWallet', () => {
  describe('sign', () => {
    const message = 'meessage';
    let wallet: Wallet;
    let deployedWallet: DeployedWallet;
    let expectedSignature: string;

    before(async () => {
      wallet = Wallet.createRandom();
      deployedWallet = new DeployedWallet(wallet.address, 'bob.poppularapp.test', wallet.privateKey, {} as any);
      expectedSignature = await wallet.signMessage(message);
    });

    it('can sign', () => {
      const bytes = utils.toUtf8Bytes(message);
      expect(deployedWallet.signMessage(bytes)).to.eq(expectedSignature);
    });
  });
});
