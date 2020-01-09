import {expect} from 'chai';
import {TEST_ACCOUNT_ADDRESS, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT, OperationType, KeyPair, sign, signString} from '@universal-login/commons';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {BlockchainService, messageToSignedMessage, calculateMessageHash, calculateGnosisStringHash, signStringMessage} from '@universal-login/contracts';
import {setupGnosisSafeContract} from '@universal-login/contracts/testutils';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Beta2Service} from '../../../src/integration/ethereum/Beta2Service';
import {Contract, Wallet, utils} from 'ethers';
import createWalletContract from '../../testhelpers/createWalletContract';
import {getTestSignedMessage} from '../../testconfig/message';
import {GnosisSafeService} from '../../../src/integration/ethereum/GnosisSafeService';

const MAGICVALUE = '0x20c13b0b';
const INVALIDSIGNATURE = '0xffffffff';

describe('INT: WalletContractService', () => {
  let walletContractService: WalletContractService;
  let proxyContract: Contract;
  let master: Contract;
  let wallet: Wallet;

  before(async () => {
    const provider = createMockProvider();
    const blockchainService = new BlockchainService(provider);
    const beta2Service = new Beta2Service(provider);
    const gnosisSafeService = new GnosisSafeService(provider);
    walletContractService = new WalletContractService(blockchainService, beta2Service, gnosisSafeService);
    [wallet] = getWallets(provider);
    ({proxy: proxyContract, master} = await createWalletContract(wallet));
  });

  describe('beta2', () => {
    it('returns false if key doesn`t exists', async () => {
      expect(await walletContractService.keyExist(proxyContract.address, TEST_ACCOUNT_ADDRESS)).to.be.false;
    });

    it('returns true if key exists', async () => {
      expect(await walletContractService.keyExist(proxyContract.address, wallet.address)).to.be.true;
    });

    it('calculates message hash', async () => {
      const message = {...getTestSignedMessage(), from: proxyContract.address};
      const testSignedMsgHash = '0x05a728fe92e4d942a172d5268f7fb765c29ed4c0771962bd32cc11e31a45e2ba';
      expect(await walletContractService.calculateMessageHash(message)).to.eq(testSignedMsgHash);
    });

    it('recovers signer from message', async () => {
      const message = {
        to: TEST_ACCOUNT_ADDRESS,
        value: utils.bigNumberify(1),
        from: proxyContract.address,
        data: '0x0',
        gasPrice: TEST_GAS_PRICE,
        gasToken: ETHER_NATIVE_TOKEN.address,
        gasLimit: DEFAULT_GAS_LIMIT,
        nonce: 0,
        operationType: OperationType.call,
        refundReceiver: TEST_ACCOUNT_ADDRESS,
      };
      const signedMessage = messageToSignedMessage(message, wallet.privateKey, 'istanbul', 'beta2');
      expect(await walletContractService.recoverSignerFromMessage(signedMessage)).to.eq(wallet.address);
    });

    it('returns proper required signatures count', async () => {
      expect(await walletContractService.getRequiredSignatures(proxyContract.address)).to.eq(1);
    });

    it('fetchMasterAddress returns proper address', async () => {
      expect(await walletContractService.fetchMasterAddress(proxyContract.address)).to.eq(master.address);
    });

    it('returns magic value if proper signature', async () => {
      const message = 'Hi, how are you?';
      const signature = signString(message, wallet.privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(MAGICVALUE);
    });

    it('returns invalid signature bytes for invalid signature', async () => {
      const message = 'Hi, how are you?';
      const signature = signString(message, Wallet.createRandom().privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(INVALIDSIGNATURE);
    });
  });

  describe('beta3', () => {
    let keyPair: KeyPair;

    before(async () => {
      ({proxy: proxyContract, master, keyPair} = await setupGnosisSafeContract(wallet));
    });

    it('returns false if key doesn`t exists', async () => {
      expect(await walletContractService.keyExist(proxyContract.address, TEST_ACCOUNT_ADDRESS)).to.be.false;
    });

    it('returns true if key exists', async () => {
      expect(await walletContractService.keyExist(proxyContract.address, keyPair.publicKey)).to.be.true;
    });

    it('calculates message hash', async () => {
      const message = {...getTestSignedMessage(), from: proxyContract.address};
      const testSignedMsgHash = calculateMessageHash(message);
      expect(await walletContractService.calculateMessageHash(message)).to.eq(testSignedMsgHash);
    });

    it('returns proper required signatures count', async () => {
      expect(await walletContractService.getRequiredSignatures(proxyContract.address)).to.eq(1);
    });

    it('recovers signer from message', async () => {
      const message = {...getTestSignedMessage(), from: proxyContract.address};
      const signedMessage = {...message, signature: sign(calculateMessageHash(message) as any, keyPair.privateKey)};
      expect(await walletContractService.recoverSignerFromMessage(signedMessage)).to.eq(keyPair.publicKey);
    });

    it('fetchMasterAddress returns proper address', async () => {
      expect(await walletContractService.fetchMasterAddress(proxyContract.address)).to.eq(master.address);
    });

    it('returns magic value if proper signature', async () => {
      const message = 'Hi, how are you?';
      const msgHash = calculateGnosisStringHash(message, proxyContract.address);
      const signature = signStringMessage(msgHash, keyPair.privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(MAGICVALUE);
    });

    it('returns invalid signature bytes for invalid signature', async () => {
      const message = 'Hi, how are you?';
      const msgHash = calculateGnosisStringHash(message, proxyContract.address);
      const signature = signStringMessage(msgHash, Wallet.createRandom().privateKey);
      await expect(walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.be.rejectedWith('Invalid owner provided');
    });
  });
});
