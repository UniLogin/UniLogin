import {KeyPair, createKeyPair, ProviderService} from '@unilogin/commons';
import {ContractService, calculateGnosisStringHash, signStringMessage, GnosisSafeInterface, SENTINEL_OWNERS} from '@unilogin/contracts';
import {setupWalletContract, setupGnosisSafeContract, executeAddKeyGnosis} from '@unilogin/contracts/testutils';
import {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {Contract, utils, Wallet} from 'ethers';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import {GnosisSafeService} from '../../../src/integration/ethereum/GnosisSafeService';

describe('INT: WalletContractService', () => {
  const provider = new MockProvider();
  const [wallet] = provider.getWallets();
  const providerService = new ProviderService(provider);
  const walletService = new WalletContractService(
    new ContractService(providerService),
    new Beta2Service(provider),
    new GnosisSafeService(provider),
  );
  let proxyWallet: Contract;
  let keyPair: KeyPair;

  describe('beta2', () => {
    before(async () => {
      ({proxyWallet, keyPair} = await setupWalletContract(wallet));
    });

    it('getWalletService', async () => {
      expect(await walletService.getWalletService(proxyWallet.address) instanceof Beta2Service).to.be.true;
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

    it('returns KeyAdded for KeyAdded event', async () => {
      expect(await walletService.getEventNameFor(proxyWallet.address, 'KeyAdded')).to.eq('KeyAdded');
    });

    it('returns KeyRemoved for KeyRemoved event', async () => {
      expect(await walletService.getEventNameFor(proxyWallet.address, 'KeyRemoved')).to.eq('KeyRemoved');
    });
  });

  describe('beta3', () => {
    before(async () => {
      ({proxy: proxyWallet, keyPair} = await setupGnosisSafeContract(wallet));
    });

    it('getWalletService', async () => {
      expect(await walletService.getWalletService(proxyWallet.address) instanceof GnosisSafeService).to.be.true;
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
      const messagePayload = utils.arrayify(utils.toUtf8Bytes(message));
      const msgHash = calculateGnosisStringHash(messagePayload, proxyWallet.address);
      const signature = signStringMessage(msgHash, keyPair.privateKey);
      expect(await walletService.signMessage(proxyWallet.address, keyPair.privateKey, messagePayload)).to.eq(signature);
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

    it('returns AddedOwner for KeyAdded event', async () => {
      expect(await walletService.getEventNameFor(proxyWallet.address, 'KeyAdded')).to.eq('AddedOwner');
    });

    it('returns RemovedOwner for KeyRemoved event', async () => {
      expect(await walletService.getEventNameFor(proxyWallet.address, 'KeyRemoved')).to.eq('RemovedOwner');
    });
  });
});
