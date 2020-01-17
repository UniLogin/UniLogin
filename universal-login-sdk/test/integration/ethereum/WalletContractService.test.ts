import {KeyPair, createKeyPair} from '@universal-login/commons';
import {BlockchainService, calculateGnosisStringHash, signStringMessage, GnosisSafeInterface, SENTINEL_OWNERS} from '@universal-login/contracts';
import {setupWalletContract, setupGnosisSafeContract, executeAddKeyGnosis} from '@universal-login/contracts/testutils';
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
    let gnosisSafeService: GnosisSafeService;

    before(async () => {
      const blockchainService = new BlockchainService(provider);
      gnosisSafeService = new GnosisSafeService(provider);
      walletService = new WalletContractService(blockchainService, new Beta2Service(provider), gnosisSafeService);
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

    it('encodes function that adds key', async () => {
      const {publicKey} = createKeyPair();
      const expectedEncodedFunction = GnosisSafeInterface.functions.addOwnerWithThreshold.encode([publicKey, 1]);
      expect(await walletService.encodeFunction(proxyWallet.address, 'addKey', [publicKey])).to.eq(expectedEncodedFunction);
    });

    it('encodes removeKey', async () => {
      const {publicKey} = createKeyPair();
      await executeAddKeyGnosis(wallet, proxyWallet.address, publicKey, keyPair.privateKey);
      const expectedEncodedFunction = GnosisSafeInterface.functions.removeOwner.encode([SENTINEL_OWNERS, publicKey, 1]);
      expect(await walletService.encodeFunction(proxyWallet.address, 'removeKey', [publicKey])).to.eq(expectedEncodedFunction);
    });

    it('encodes setRequiredSignatures', async () => {
      const expectedEncodedFunction = GnosisSafeInterface.functions.changeThreshold.encode([2]);
      expect(await walletService.encodeFunction(proxyWallet.address, 'setRequiredSignatures', [2])).to.eq(expectedEncodedFunction);
    });
  });
});
