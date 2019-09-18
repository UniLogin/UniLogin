import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {utils, Wallet} from 'ethers';
import Proxy from '@universal-login/contracts/build/WalletProxy.json';
import basicSDK, {transferMessage} from '../fixtures/basicSDK';
import {signRelayerRequest} from '@universal-login/commons';
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
    message = {...transferMessage, from: contractAddress, gasToken: mockToken.address, data: '0x'};
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

      it('should register ENS name', async () => {
        expect(await relayer.provider.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
      });

      it('should return ens config', async () => {
        const expectedEnsAddress = relayer.config.chainSpec.ensAddress;
        const response = await sdk.getRelayerConfig();
        expect(response.chainSpec.ensAddress).to.eq(expectedEnsAddress);
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
      message = {...message, gasLimit: utils.parseEther('25').toString()};
      const {waitToBeMined} = await sdk.execute(message, privateKey);
      await expect(waitToBeMined()).to.be.eventually.rejectedWith('Error: Not enough tokens');
    });

    it('when not enough gas', async () => {
      const gasData = 8720;
      const notEnoughGasLimit = 100;
      message = {...message, gasLimit: gasData + notEnoughGasLimit};
      await expect(sdk.execute(message, privateKey)).to.be.eventually.rejectedWith('Insufficient Gas. gasLimit should be greater than 105000');
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
      expect(await walletContract.keyExist(otherWallet.address)).to.be.true;
    });

    it('should add a device to connected devices', async () => {
      const initiallyDevicesLength = (await sdk.getConnectedDevices(contractAddress, privateKey)).length;
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      expect(await sdk.getConnectedDevices(contractAddress, privateKey)).length(initiallyDevicesLength + 1);
    });
  });

  describe('keyExist', async () => {
    it('return an invalid key if key is not added', async () => {
      expect(await sdk.keyExist(contractAddress, otherWallet.address)).to.be.false;
    });

    it('return a management key', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      expect(await sdk.keyExist(contractAddress, otherWallet.address)).to.be.true;
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
        const authorisationRequest = signRelayerRequest({contractAddress}, privateKey);
        expect(await sdk.authorisationsObserver.fetchPendingAuthorisations(authorisationRequest)).to.deep.eq([]);
      });


      it('should return pending authorisations', async () => {
        const {privateKey: devicePrivateKey} = await sdk.connect(contractAddress);
        const wallet = new Wallet(devicePrivateKey);

        const authorisationRequest = signRelayerRequest({contractAddress}, privateKey);

        const response = await sdk.authorisationsObserver.fetchPendingAuthorisations(authorisationRequest);
        expect(response[response.length - 1]).to.deep.include({key: wallet.address});
      });

      it('should return private key', async () => {
        const {privateKey: newDevicePrivateKey} = await sdk.connect(contractAddress);
        expect(newDevicePrivateKey).to.be.properPrivateKey;
      });
    });
  });

  describe('Devices', async () => {
    it('should return added devices', async () => {
      const initiallyPublicKeys = (await sdk.getConnectedDevices(contractAddress, privateKey)).map((device) => device.publicKey);
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      const devicesPublicKeys = (await sdk.getConnectedDevices(contractAddress, privateKey)).map((device) => device.publicKey);
      expect(devicesPublicKeys).length(initiallyPublicKeys.length + 1);
      expect(devicesPublicKeys).to.be.deep.eq([...initiallyPublicKeys, otherWallet.address]);
    });
  });

  describe('change required signatures', async () => {
    it('should change required signatures', async () => {
      const {waitToBeMined} = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
      await waitToBeMined();
      ({waitToBeMined} = await sdk.setRequiredSignatures(contractAddress, 2, privateKey, {gasToken: mockToken.address}));
      const {transactionHash} = await waitToBeMined();
      expect(await walletContract.requiredSignatures()).to.eq(2);
      expect(transactionHash).to.be.properHex(64);
    });
  });

  describe('get message status', async () => {
    it('should return message status', async () => {
      await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
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
