import {KeyPair} from '@universal-login/commons';
import {BlockchainService, calculateGnosisStringHash, signStringMessage} from '@universal-login/contracts';
import {setupWalletContract, setupGnosisSafeContract} from '@universal-login/contracts/testutils';
import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Contract, utils, Wallet} from 'ethers';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../../src/integration/ethereum/GnosisSafeService';

describe('INT: WalletContractService', () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let walletService: WalletContractService;
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  describe('beta2', () => {
    before(async () => {
      walletService = new WalletContractService(new BlockchainService(provider), new Beta2Service(provider), new GnosisSafeService(provider));
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

  describe('beta3', () => {
    before(async () => {
      const blockchainService = new BlockchainService(provider);
      walletService = new WalletContractService(blockchainService, new Beta2Service(provider), new GnosisSafeService(provider));
      ({proxy: proxyWallet, keyPair} = await setupGnosisSafeContract(wallet));
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
      const message = 'Hi, how are you?';
      const msgHash = calculateGnosisStringHash(message, proxyWallet.address);
      const signature = signStringMessage(msgHash, keyPair.privateKey);
      expect(await walletService.signMessage(proxyWallet.address, keyPair.privateKey, message)).to.eq(signature);
    });

    it('throws error if message is not string', async () => {
      const message = 'Hi, how are you?';
      await expect(walletService.signMessage(proxyWallet.address, keyPair.privateKey, utils.toUtf8Bytes(message))).to.be.rejectedWith('Invalid message type. Expected type: string.');
    });
  });
});
