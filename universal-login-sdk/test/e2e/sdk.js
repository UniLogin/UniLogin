import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {utils, Wallet} from 'ethers';
import Proxy from '@universal-login/contracts/build/KitsuneProxy';
import basicSDK, {transferMessage} from '../fixtures/basicSDK';
import {MANAGEMENT_KEY, ACTION_KEY, CLAIM_KEY, ENCRYPTION_KEY, signGetAuthorisationRequest, createKeyPair} from '@universal-login/commons';
import UniversalLoginSDK from '../../lib/api/sdk';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();
const jsonRpcUrl = 'http://localhost:18545';

describe('E2E: SDK', async () => {
  let provider;
  let relayer;
  let sdk;
  let contractAddress;
  let privateKey;
  let otherWallet;
  let otherWallet2;
  let mockToken;
  let message;
  let walletContract;

  beforeEach(async () => {
    ({provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, walletContract, relayer} = await loadFixture(basicSDK));
    message = {...transferMessage, from: contractAddress, gasToken: mockToken.address};
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  describe('Create', async () => {
    describe('Initalization', () => {
      it('creates provider from URL', () => {
        const universalLoginSDK = new UniversalLoginSDK(relayer.url(), jsonRpcUrl);
        expect(universalLoginSDK.provider.connection.url).to.eq(jsonRpcUrl);
      });

      it('should return proper private key and address', async () => {
        [privateKey, contractAddress] = await sdk.create('test.mylogin.eth');
        expect(privateKey).to.be.properPrivateKey;
        expect(contractAddress).to.be.properAddress;
      });

      it('should register ENS name', async () => {
        expect(await relayer.provider.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
      });

      it('should return ens config', async () => {
        const expectedEnsAddress = relayer.config.chainSpec.ensAddress;
        const response = await sdk.getRelayerConfig();
        expect(response.chainSpec.ensAddress).to.eq(expectedEnsAddress);
      });

      it('should throw InvalidENS exception if invalid ENS name', async () => {
        await expect(sdk.create('alex.non-existing-id.eth')).to.be.eventually.rejectedWith('ENS domain alex.non-existing-id.eth does not exist or is not compatible with Universal Login');
      });
    });
  });

  describe('Execute signed message', async () => {
    it('Should execute signed message', async () => {
      const expectedBalance = (await otherWallet.getBalance()).add(utils.parseEther('0.5'));
      const {waitToBeMined} = await sdk.execute({...message, to: otherWallet.address}, privateKey);
      const {transactionHash} = await waitToBeMined();
      expect(transactionHash).to.match(/^[0x|0-9|a-f|A-F]{66}/);
      expect(await otherWallet.getBalance()).to.eq(expectedBalance);
    });

    it('Should return transaction hash', async () => {
      const {waitToBeMined} = await sdk.execute(message, privateKey);
      const {transactionHash} = await waitToBeMined();
      expect(transactionHash).to.be.properHex(64);
    });

    it('Should increment nonce', async () => {
      expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(0);
      const {waitToBeMined} = await sdk.execute(message, privateKey);
      await waitToBeMined();
      expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(1);
      ({waitToBeMined} = await sdk.execute(message, privateKey));
      await waitToBeMined();
      expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(2);
    });

    it('when not enough tokens ', async () => {
      message = {...transferMessage, gasToken: mockToken.address, from: contractAddress, gasLimit: utils.parseEther('25').toString()};
      const {waitToBeMined} = await sdk.execute(message, privateKey);
      await expect(waitToBeMined()).to.be.eventually.rejectedWith('Error: Not enough tokens');
    });

    it('when not enough gas', async () => {
      message = {...transferMessage, gasToken: mockToken.address, from: contractAddress, gasLimit: '100'};
      const {waitToBeMined} = await sdk.execute(message, privateKey);
      await expect(waitToBeMined()).to.be.eventually.rejectedWith('Error: Not enough gas');
    });
  });

  describe('Add key', async () => {
    it('should return transaction hash', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      const {transactionHash} = await waitToBeMined();
      expect(transactionHash).to.be.properHex(64);
      expect(await walletContract.lastNonce()).to.be.eq(1);
    });

    it('should add a management key to the walletContract', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.be.eq(MANAGEMENT_KEY);
    });

    it('should add an action key to the walletContract', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, ACTION_KEY);
      await waitToBeMined();
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.be.eq(ACTION_KEY);
    });

    it('should add a claim key to the walletContract', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, CLAIM_KEY);
      await waitToBeMined();
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.be.eq(CLAIM_KEY);
    });

    it('should add an encryption key to the walletContract', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, ENCRYPTION_KEY);
      await waitToBeMined();
      expect(await walletContract.getKeyPurpose(otherWallet.address)).to.be.eq(ENCRYPTION_KEY);
    });
  });

  describe('Get nonce', async () => {
    it('getNonce should return correct nonce', async () => {
      const executionNonce = await sdk.getNonce(contractAddress, privateKey);
      expect(executionNonce).to.eq(0);
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(executionNonce.add(1));
    });
  });

  describe('Get relayer config', async () => {
    it('getRelayerConfig return config which should have properties', async () => {
      const relayerConfig = await sdk.getRelayerConfig();
      expect(relayerConfig).to.haveOwnProperty('supportedTokens');
      expect(relayerConfig).to.haveOwnProperty('chainSpec');
      expect(relayerConfig).to.haveOwnProperty('factoryAddress');
      expect(relayerConfig).to.haveOwnProperty('contractWhiteList');
      expect(relayerConfig).to.haveOwnProperty('localization');
      expect(relayerConfig).to.haveOwnProperty('onRampProviders');
    });
  });

  describe('Add keys', async () => {
    it('should return transaction hash', async () => {
      const {waitToBeMined} = await sdk.addKeys(contractAddress, [otherWallet.address, otherWallet2.address], privateKey, {gasToken: mockToken.address});
      const {transactionHash} = await waitToBeMined();
      expect(transactionHash).to.be.properHex(64);
    });
  });

  describe('Proxy Exists', async () => {
    it('should return correct bytecode', async () => {
      const address = await sdk.resolveName('alex.mylogin.eth');
      expect(Proxy.evm.deployedBytecode.object.slice(0)).to.eq((await provider.getCode(address)).slice(2));
    });

    it('should return false if no resolver address', async () => {
      expect(await sdk.resolveName('no-such-login.mylogin.eth')).to.be.false;
    });

    it('should get correct address', async () => {
      expect(await sdk.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
    });

    it('should return walletContract address if walletContract exist', async () => {
      expect(await sdk.getWalletContractAddress('alex.mylogin.eth')).to.eq(contractAddress);
    });

    it('should return null if walletContract doesn`t exist', async () => {
      expect(await sdk.getWalletContractAddress('no-such-login.mylogin.eth')).to.be.null;
    });

    it('should return true if walletContract exist', async () => {
      expect(await sdk.walletContractExist('alex.mylogin.eth')).to.be.true;
    });

    it('should return false if walletContract doesn`t exist', async () => {
      expect(await sdk.walletContractExist('no-such-login.mylogin.eth')).to.be.false;
    });

    describe('Authorisation', async () => {
      it('no pending authorisations', async () => {
        const getAuthorisationRequest = signGetAuthorisationRequest({walletContractAddress: contractAddress.toLowerCase()}, privateKey);
        expect(await sdk.authorisationsObserver.fetchPendingAuthorisations(getAuthorisationRequest)).to.deep.eq([]);
      });


      it('should return pending authorisations', async () => {
        const {privateKey: devicePrivateKey} = await sdk.connect(contractAddress);
        const wallet = new Wallet(devicePrivateKey);

        const getAuthorisationRequest = signGetAuthorisationRequest({walletContractAddress: contractAddress.toLowerCase()}, privateKey);

        const response = await sdk.authorisationsObserver.fetchPendingAuthorisations(getAuthorisationRequest);
        expect(response[response.length - 1]).to.deep.include({key: wallet.address.toLowerCase()});
      });

      it('should return private key', async () => {
        const {privateKey: newDevicePrivateKey} = await sdk.connect(contractAddress);
        expect(newDevicePrivateKey).to.be.properPrivateKey;
      });

      it('should return public key when deny request', async () => {
        await sdk.connect(contractAddress);
        const {publicKey} = createKeyPair();
        const response = await sdk.denyRequest(contractAddress, publicKey, privateKey);
        expect(response).to.eq(publicKey);
      });
    });
  });

  describe('change required signatures', async () => {
    it('should change required signatures', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, CLAIM_KEY);
      await waitToBeMined();
      ({waitToBeMined} = await sdk.setRequiredSignatures(contractAddress, 2, privateKey, {gasToken: mockToken.address}));
      const {transactionHash} = await waitToBeMined();
      expect(await walletContract.requiredSignatures()).to.eq(2);
      expect(transactionHash).to.be.properHex(64);
    });
  });

  describe('get message status', async () => {
    it('should return message status', async () => {
      await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, CLAIM_KEY);
      await sdk.setRequiredSignatures(contractAddress, 2, privateKey, {gasToken: mockToken.address});
      const msg = {...message, to: otherWallet.address, nonce: await walletContract.lastNonce()};
      const {messageStatus} = await sdk.execute(msg, privateKey);
      const status = await sdk.getMessageStatus(messageStatus.messageHash);
      expect(status.collectedSignatures.length).to.eq(1);
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
