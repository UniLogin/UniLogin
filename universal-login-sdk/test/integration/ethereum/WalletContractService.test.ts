import {expect} from 'chai';
import {BlockchainService} from '@universal-login/contracts';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {setupWalletContract} from '@universal-login/contracts/testutils';
import {Contract, utils, Wallet} from 'ethers';
import {KeyPair} from '@universal-login/commons';

describe('INT: WalletContractService', () => {
  describe('beta2', () => {
    const provider = createMockProvider();
    const [wallet] = getWallets(provider);
    let walletService: WalletContractService;
    let proxyWallet: Contract;
    let keyPair: KeyPair;

    before(async () => {
      walletService = new WalletContractService(new BlockchainService(provider), new Beta2Service(provider));
      ({proxyWallet, keyPair} = await setupWalletContract(wallet));
    });

    it('last nonce returns proper number', async () => {
      expect(await walletService.lastNonce(proxyWallet.address)).to.eq(0);
    });

    it('key exists return true', async () => {
      expect(await walletService.keyExist(proxyWallet.address, keyPair.publicKey)).to.be.true;
    });

    it('returns proper number of requiredSignatures', async () => {
      expect(await walletService.requiredSignatures(proxyWallet.address)).to.eq(1);
    });

    it('correctly calculates signature', async () => {
      const msg = 'simple message';
      const bytes = utils.toUtf8Bytes(msg);
      const signer = new Wallet(keyPair.privateKey);
      expect(await walletService.signMessage(proxyWallet.address, keyPair.privateKey, bytes)).to.eq(await signer.signMessage(msg));
    });
  });
});
