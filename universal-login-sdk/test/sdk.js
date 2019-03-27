import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import {solidity, createFixtureLoader} from 'ethereum-waffle';
import {utils, Wallet} from 'ethers';
import WalletContract from 'universal-login-contracts/build/WalletContract';
import basicSDK, {transferMessage} from './fixtures/basicSDK';
import {MANAGEMENT_KEY, ACTION_KEY, CLAIM_KEY, ENCRYPTION_KEY} from 'universal-login-contracts';
import UniversalLoginSDK from '../lib/sdk';

chai.use(solidity);
chai.use(sinonChai);
chai.use(chaiAsPromised);

const loadFixture = createFixtureLoader();
const jsonRpcUrl = 'http://localhost:18545';

describe('SDK - integration', async () => {
  let provider;
  let relayer;
  let sdk;
  let contractAddress;
  let privateKey;
  let otherWallet;
  let otherWallet2;
  let mockToken;
  let message;
  let identity;


  beforeEach(async () => {
    ({provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, contractAddress, identity, relayer} = await loadFixture(basicSDK));
    message = {...transferMessage, from: contractAddress, gasToken: mockToken.address};
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
        expect(response.config.ensAddress).to.eq(expectedEnsAddress);
      });

      it('should throw InvalidENS exception if invalid ENS name', async () => {
        await expect(sdk.create('alex.non-existing-id.eth')).to.be.eventually.rejectedWith('Error: domain not existing / not universal ID compatible');
      });
    });

    describe('Execute signed message', async () => {
      it('Should execute signed message', async () => {
        const expectedBalance = (await otherWallet.getBalance()).add(utils.parseEther('0.5'));
        await sdk.execute({...message, to: otherWallet.address}, privateKey);
        expect(await otherWallet.getBalance()).to.eq(expectedBalance);
      });

      it('Should return transaction hash', async () => {
        const hash = await sdk.execute(message, privateKey);
        expect(hash).to.be.properHex(64);
      });

      it('Should increment nonce', async () => {
        expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(0);
        await sdk.execute(message, privateKey);
        expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(1);
        await sdk.execute(message, privateKey);
        expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(2);
      });

      it('when not enough tokens ', async () => {
        message = {...transferMessage, gasToken: mockToken.address, from: contractAddress, gasLimit: utils.parseEther('25').toString()};
        await expect(sdk.execute(message, privateKey)).to.be.eventually.rejectedWith('Error: Not enough tokens');
      });
    });

    describe('Add key', async () => {
      it('should return transaction hash', async () => {
        const hash = await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
        expect(hash).to.be.properHex(64);
        expect(await identity.lastNonce()).to.be.eq(1);
      });

      it('should add a management key to the identity', async () => {
        await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
        expect(await identity.getKeyPurpose(otherWallet.address)).to.be.eq(MANAGEMENT_KEY);
      });

      it('should add an action key to the identity', async () => {
        await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, ACTION_KEY);
        expect(await identity.getKeyPurpose(otherWallet.address)).to.be.eq(ACTION_KEY);
      });

      it('should add a claim key to the identity', async () => {
        await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, CLAIM_KEY);
        expect(await identity.getKeyPurpose(otherWallet.address)).to.be.eq(CLAIM_KEY);
      });

      it('should add an encryption key to the identity', async () => {
        await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address}, ENCRYPTION_KEY);
        expect(await identity.getKeyPurpose(otherWallet.address)).to.be.eq(ENCRYPTION_KEY);
      });
    });

    describe('Get nonce', async () => {
      it('getNonce should return correct nonce', async () => {
        const executionNonce = await sdk.getNonce(contractAddress, privateKey);
        expect(executionNonce).to.eq(0);
        await sdk.addKey(contractAddress, otherWallet.address, privateKey, {gasToken: mockToken.address});
        expect(await sdk.getNonce(contractAddress, privateKey)).to.eq(executionNonce.add(1));
      });
    });

    describe('Add keys', async () => {
      it('should return transaction hash', async () => {
        const hash = await sdk.addKeys(contractAddress, [otherWallet.address, otherWallet2.address], privateKey, {gasToken: mockToken.address});
        expect(hash).to.be.properHex(64);
      });
    });

    describe('WalletContract Exists', async () => {
      it('should return correct bytecode', async () => {
        const address = await sdk.resolveName('alex.mylogin.eth');
        expect(WalletContract.evm.deployedBytecode.object.slice(0, 14666)).to.eq((await provider.getCode(address)).slice(2, 14668));
      });

      it('should return false if no resolver address', async () => {
        expect(await sdk.resolveName('no-such-login.mylogin.eth')).to.be.false;
      });

      it('should get correct address', async () => {
        expect(await sdk.resolveName('alex.mylogin.eth')).to.eq(contractAddress);
      });

      it('should return identity address if identity exist', async () => {
        expect(await sdk.walletContractExist('alex.mylogin.eth')).to.eq(contractAddress);
      });

      it('should return false if identity doesn`t exist', async () => {
        expect(await sdk.walletContractExist('no-such-login.mylogin.eth')).to.be.false;
      });

      describe('Authorisation', async () => {
        it('no pending authorisations', async () => {
          expect(await sdk.relayerObserver.fetchPendingAuthorisations(contractAddress)).to.deep.eq([]);
        });

        it('should return pending authorisations', async () => {
          const privateKey = await sdk.connect(contractAddress);
          const wallet = new Wallet(privateKey);
          const response = await sdk.relayerObserver.fetchPendingAuthorisations(contractAddress);
          expect(response[response.length - 1]).to.deep.include({key: wallet.address.toLowerCase()});
        });

        it('should return private key', async () => {
          expect(await sdk.connect(contractAddress)).to.be.properPrivateKey;
        });

        it('should return public key when deny request', async () => {
          const privateKey = await sdk.connect(contractAddress);
          const wallet = new Wallet(privateKey);
          const response = await sdk.denyRequest(contractAddress, wallet.address);
          expect(response).to.eq(wallet.address);
        });
      });
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
