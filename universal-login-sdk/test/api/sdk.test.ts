import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {providers, Wallet} from 'ethers';
import {gnosisSafe} from '@unilogin/contracts';
import {TEST_SDK_CONFIG} from '@unilogin/commons';
import {RelayerUnderTest} from '@unilogin/relayer';
import basicSDK from '../fixtures/basicSDK';
import UniLoginSdk from '../../src/api/sdk';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();
const jsonRpcUrl = 'http://localhost:18545';

describe('INT: SDK', () => {
  let provider: providers.Provider;
  let relayer: RelayerUnderTest;
  let sdk: UniLoginSdk;
  let contractAddress: string;
  let privateKey: string;

  beforeEach(async () => {
    ({provider, sdk, privateKey, contractAddress, relayer} = await loadFixture(basicSDK));
  });

  afterEach(async () => {
    await relayer.clearDatabase();
  });

  describe('Create', () => {
    describe('Initalization', () => {
      it('creates provider from URL', () => {
        const universalLoginSDK = new UniLoginSdk(relayer.url(), jsonRpcUrl, TEST_SDK_CONFIG);
        const provider = universalLoginSDK.provider as providers.JsonRpcProvider;
        expect(provider.connection.url).to.eq(jsonRpcUrl);
      });

      it('isRefundPaid returns false if no api key', () => {
        expect(sdk.isRefundPaid()).to.be.false;
      });

      it('isRefundPaid returns true if api key was passed in config', () => {
        const sdk = new UniLoginSdk(relayer.url(), jsonRpcUrl, {...TEST_SDK_CONFIG, apiKey: 'API_KEY'});
        expect(sdk.isRefundPaid()).to.be.true;
      });

      it('should register ENS name', async () => {
        expect(await relayer.provider.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
      });

      it('should return ens config', () => {
        const expectedEnsAddress = relayer.getConfig().ensAddress;
        const response = sdk.getRelayerConfig();
        expect(response!.ensAddress).to.eq(expectedEnsAddress);
      });
    });
  });

  describe('Get relayer config', () => {
    it('getRelayerConfig return config which should have properties', () => {
      const relayerConfig = sdk.getRelayerConfig();
      expect(relayerConfig).to.haveOwnProperty('supportedTokens');
      expect(relayerConfig).to.haveOwnProperty('ensAddress');
      expect(relayerConfig).to.haveOwnProperty('network');
      expect(relayerConfig).to.haveOwnProperty('factoryAddress');
      expect(relayerConfig).to.haveOwnProperty('contractWhiteList');
      expect(relayerConfig).to.haveOwnProperty('localization');
      expect(relayerConfig).to.haveOwnProperty('onRampProviders');
      expect(relayerConfig).to.haveOwnProperty('maxGasLimit');
    });
  });

  describe('Proxy Exists', () => {
    it('should return correct bytecode', async () => {
      const address = await sdk.resolveName('alex.mylogin.eth');
      expect(address).to.not.be.null;
      expect(gnosisSafe.Proxy.evm.deployedBytecode.object.slice(0)).to.eq((await provider.getCode(address!)).slice(2));
    });

    it('should return null if no resolver address', async () => {
      expect(await sdk.resolveName('no-such-login.mylogin.eth')).to.be.null;
    });

    it('should get correct address', async () => {
      expect(await sdk.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
    });

    it('should return walletContract address if walletContract exist', async () => {
      expect(await sdk.getWalletContractAddress('alex.mylogin.eth')).to.eq(contractAddress);
    });

    it('should return null if walletContract doesn`t exist', async () => {
      await expect(sdk.getWalletContractAddress('no-such-login.mylogin.eth')).to.rejectedWith('Unable to resolve ENS name: no-such-login.mylogin.eth');
    });

    it('should return true if walletContract exist', async () => {
      expect(await sdk.walletContractExist('alex.mylogin.eth')).to.be.true;
    });

    it('should return false if walletContract doesn`t exist', async () => {
      expect(await sdk.walletContractExist('no-such-login.mylogin.eth')).to.be.false;
    });

    describe('Authorisation', () => {
      it('no pending authorisations', async () => {
        const authorisationRequest = await sdk.walletContractService.signRelayerRequest(privateKey, {contractAddress});
        expect(await sdk.authorisationsObserver.fetchPendingAuthorisations(authorisationRequest)).to.deep.eq([]);
      });

      it('should return pending authorisations', async () => {
        const {privateKey: devicePrivateKey} = await sdk.connect(contractAddress);
        const wallet = new Wallet(devicePrivateKey);

        const authorisationRequest = await sdk.walletContractService.signRelayerRequest(privateKey, {contractAddress});

        const response = await sdk.authorisationsObserver.fetchPendingAuthorisations(authorisationRequest);
        expect(response[response.length - 1]).to.deep.include({key: wallet.address});
      });

      it('should return private key', async () => {
        const {privateKey: newDevicePrivateKey} = await sdk.connect(contractAddress);
        expect(newDevicePrivateKey).to.be.properPrivateKey;
      });
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
