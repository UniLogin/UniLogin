import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {TEST_ACCOUNT_ADDRESS, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, DEFAULT_GAS_LIMIT, OperationType, KeyPair, signString, createKeyPair, CURRENT_NETWORK_VERSION, SignedMessage, calculateMessageHash} from '@unilogin/commons';
import {WalletContractService} from '../../../src/integration/ethereum/WalletContractService';
import {messageToSignedMessage, calculateGnosisStringHash, calculateMessageHash as calculateMessageHashGnosis, signStringMessage, GnosisSafeInterface, calculateMessageSignature} from '@unilogin/contracts';
import {ERC1271} from '@unilogin/contracts';
import {setupGnosisSafeContract, executeAddKeyGnosis, executeRemoveKey} from '@unilogin/contracts/testutils';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {Contract, Wallet, utils} from 'ethers';
import createWalletContract from '../../testhelpers/createWalletContract';
import {getTestSignedMessage} from '../../testconfig/message';
import {setupWalletContractService} from '../../testhelpers/setupWalletContractService';
import {INVALID_MSG_HASH} from '../../../src/integration/ethereum/GnosisSafeService';

chai.use(sinonChai);

describe('INT: WalletContractService', () => {
  let walletContractService: WalletContractService;
  let proxyContract: Contract;
  let master: Contract;
  let wallet: Wallet;
  let signedMessage: SignedMessage;
  let fetchWalletVersionSpy: sinon.SinonSpy;

  before(async () => {
    const provider = createMockProvider();
    walletContractService = setupWalletContractService(provider);
    [wallet] = getWallets(provider);
    ({proxy: proxyContract, master} = await createWalletContract(wallet));
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
    signedMessage = messageToSignedMessage(message, wallet.privateKey, 'istanbul', 'beta2');
    fetchWalletVersionSpy = sinon.spy((walletContractService as any).blockchainService, 'fetchWalletVersion');
  });

  describe('version cache', () => {
    it('undefined address', async () => {
      await expect(walletContractService.getWalletVersion(undefined as any)).to.be.rejectedWith('Invalid address provided');
    });

    it('empty address', async () => {
      await expect(walletContractService.getWalletVersion('')).to.be.rejectedWith('Invalid address provided');
    });

    it('clear cache', async () => {
      await walletContractService.getWalletVersion(proxyContract.address);
      await walletContractService.clearCatch();
      expect((walletContractService as any).walletVersions).to.deep.eq({});
    });

    it('address with empty cache', async () => {
      const version = await walletContractService.getWalletVersion(proxyContract.address);
      expect(version).to.eq('beta2');
      expect(fetchWalletVersionSpy).to.be.calledOnce;
    });

    it('adding cache after calling address with empty cache', async () => {
      await walletContractService.getWalletVersion(proxyContract.address);
      expect((walletContractService as any).walletVersions).to.deep.eq({[proxyContract.address]: 'beta2'});
      expect(fetchWalletVersionSpy).to.be.calledOnce;
    });

    it('address with cache', async () => {
      await walletContractService.getWalletVersion(proxyContract.address);
      expect((walletContractService as any).walletVersions).to.deep.eq({[proxyContract.address]: 'beta2'});
      await walletContractService.getWalletVersion(proxyContract.address);
      expect(fetchWalletVersionSpy).to.be.calledOnce;
    });

    it('random address', async () => {
      const address = Wallet.createRandom().address;
      await expect(walletContractService.getWalletVersion(address)).to.be.rejectedWith('Unsupported proxy version');
    });
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
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(ERC1271.MAGICVALUE);
    });

    it('returns invalid signature bytes for invalid signature', async () => {
      const message = 'Hi, how are you?';
      const signature = signString(message, Wallet.createRandom().privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(ERC1271.INVALIDSIGNATURE);
    });

    it('isValidMessageHash returns true if msg hash is correct', async () => {
      const correctMsgHash = calculateMessageHash(signedMessage);
      expect(await walletContractService.isValidMessageHash(proxyContract.address, correctMsgHash, signedMessage)).to.be.true;
    });

    it('isValidMessageHash returns false if msg hash is invalid', async () => {
      expect(await walletContractService.isValidMessageHash(proxyContract.address, '0x949949', signedMessage)).to.be.false;
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
      const testSignedMsgHash = calculateMessageHashGnosis(message);
      expect(await walletContractService.calculateMessageHash(message)).to.eq(testSignedMsgHash);
    });

    it('returns proper required signatures count', async () => {
      expect(await walletContractService.getRequiredSignatures(proxyContract.address)).to.eq(1);
    });

    it('recovers signer from message', async () => {
      const message = {...getTestSignedMessage(), from: proxyContract.address};
      const signedMessage = {...message, signature: calculateMessageSignature(message, keyPair.privateKey)};
      expect(await walletContractService.recoverSignerFromMessage(signedMessage)).to.eq(keyPair.publicKey);
    });

    it('fetchMasterAddress returns proper address', async () => {
      expect(await walletContractService.fetchMasterAddress(proxyContract.address)).to.eq(master.address);
    });

    it('returns magic value if proper signature', async () => {
      const message = 'Hi, how are you?';
      const messagePayload = utils.arrayify(utils.toUtf8Bytes(message));
      const msgHash = calculateGnosisStringHash(messagePayload, proxyContract.address);
      const signature = signStringMessage(msgHash, keyPair.privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(ERC1271.MAGICVALUE);
    });

    it('returns invalid signature bytes for invalid signature', async () => {
      const message = 'Hi, how are you?';
      const messagePayload = utils.arrayify(utils.toUtf8Bytes(message));
      const msgHash = calculateGnosisStringHash(messagePayload, proxyContract.address);
      const signature = signStringMessage(msgHash, Wallet.createRandom().privateKey);
      expect(await walletContractService.isValidSignature(utils.hexlify(utils.toUtf8Bytes(message)), proxyContract.address, signature)).to.eq(ERC1271.INVALIDSIGNATURE);
    });

    it('decodes execute', async () => {
      const newKeyPair = createKeyPair();
      const msg = {
        to: proxyContract.address,
        from: proxyContract.address,
        data: GnosisSafeInterface.functions.addOwnerWithThreshold.encode([newKeyPair.publicKey, 1]),
        nonce: await proxyContract.nonce(),
        gasToken: ETHER_NATIVE_TOKEN.address,
        gasPrice: utils.bigNumberify(TEST_GAS_PRICE),
        gasLimit: '300000',
        operationType: OperationType.call,
        refundReceiver: wallet.address,
      };
      const {nonce, from, ...restMsg} = messageToSignedMessage(msg, keyPair.privateKey, CURRENT_NETWORK_VERSION, 'beta3');
      const transaction = await executeAddKeyGnosis(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      expect(await walletContractService.decodeExecute(proxyContract.address, transaction.data)).to.deep.eq({...restMsg, operationType: utils.bigNumberify(msg.operationType)});
    });

    it('returns true if add key call', async () => {
      const newKeyPair = createKeyPair();
      const transaction = await executeAddKeyGnosis(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const decodedMessage = await walletContractService.decodeExecute(proxyContract.address, transaction.data);
      expect(await walletContractService.isAddKeyCall(proxyContract.address, decodedMessage.data as string)).to.true;
    });

    it('returns true if remove key call', async () => {
      const newKeyPair = createKeyPair();
      await executeAddKeyGnosis(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const transaction = await executeRemoveKey(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const decodedMessage = await walletContractService.decodeExecute(proxyContract.address, transaction.data);
      expect(await walletContractService.isRemoveKeyCall(proxyContract.address, decodedMessage.data as string)).to.true;
    });

    it('decodes key from add key data', async () => {
      const newKeyPair = createKeyPair();
      const transaction = await executeAddKeyGnosis(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const decodedMessage = await walletContractService.decodeExecute(proxyContract.address, transaction.data);
      expect((await walletContractService.decodeKeyFromData(proxyContract.address, decodedMessage.data as string))[0]).to.eq(newKeyPair.publicKey);
    });

    it('decodes key from remove key data', async () => {
      const newKeyPair = createKeyPair();
      await executeAddKeyGnosis(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const transaction = await executeRemoveKey(wallet, proxyContract.address, newKeyPair.publicKey, keyPair.privateKey);
      const decodedMessage = await walletContractService.decodeExecute(proxyContract.address, transaction.data);
      expect((await walletContractService.decodeKeyFromData(proxyContract.address, decodedMessage.data as string))[0]).to.eq(newKeyPair.publicKey);
    });

    it('isValidMessageHash returns false if provided messageHash is 0x0000000000000000000000000000000000', async () => {
      expect(await walletContractService.isValidMessageHash(proxyContract.address, INVALID_MSG_HASH, {} as any)).to.be.false;
    });

    it('isValidMessageHash returns true if provided messageHash is not 0x0000000000000000000000000000000000', async () => {
      expect(await walletContractService.isValidMessageHash(proxyContract.address, '0x1234', {} as any)).to.be.true;
    });
  });

  afterEach(() => {
    fetchWalletVersionSpy.resetHistory();
    walletContractService.clearCatch();
  });
});
