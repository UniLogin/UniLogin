import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {solidity} from 'ethereum-waffle';
import ethers, {utils} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicSDK, {transferMessage, addKeyDetails} from './fixtures/basicSDK';

chai.use(solidity);
chai.use(sinonChai);

describe('SDK - integration', async () => {
  const testHelper = new TestHelper();
  let provider;
  let relayer;
  let sdk;
  let identityAddress;
  let privateKey;
  let otherWallet;
  let otherWallet2;
  let mockToken;
  let message;

  beforeEach(async () => {
    ({provider, mockToken, otherWallet, otherWallet2, sdk, privateKey, identityAddress, relayer} = await testHelper.load(basicSDK));
    message = {...transferMessage, from: identityAddress, gasToken: mockToken.address};
  });

  describe('Create', async () => {
    describe('Initalization', () => {
      it('should return proper private key and address', async () => {
        [privateKey, identityAddress] = await sdk.create('test.mylogin.eth');
        expect(privateKey).to.be.properPrivateKey;
        expect(identityAddress).to.be.properAddress;
      });

      it('should register ENS name', async () => {
        expect(await relayer.provider.resolveName('alex.mylogin.eth')).to.eq(identityAddress);
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

      it('Should return correct nonce', async () => {
        expect(await sdk.execute(message, privateKey)).to.eq(0);
        expect(await sdk.execute(message, privateKey)).to.eq(1);
        expect(await sdk.execute(message, privateKey)).to.eq(2);
        expect(await sdk.execute(message, privateKey)).to.eq(3);
        expect(await sdk.execute(message, privateKey)).to.eq(4);
      });

      it('when not enough tokens ', async () => {
        message = {...transferMessage, from: identityAddress, gasLimit: utils.parseEther('25').toString()};
        await expect(sdk.execute(message, privateKey)).to.be.eventually.rejected;
      });
    });

    describe('Add key', async () => {
      it('should return execution nonce', async () => {
        expect(await sdk.addKey(identityAddress, otherWallet.address, privateKey, {...addKeyDetails, gasToken: mockToken.address})).to.eq(0);
      });
    });

    describe('Get nonce', async () => {
      it('getNonce should return correct nonce', async () => {
        const executionNonce = await sdk.getNonce(identityAddress, privateKey);
        expect(executionNonce).to.eq(0);
        await sdk.addKey(identityAddress, otherWallet.address, privateKey, {...addKeyDetails, gasToken: mockToken.address});
        expect(await sdk.getNonce(identityAddress, privateKey)).to.eq(executionNonce.add(1));
      });
    });

    describe('Add keys', async () => {
      it('should return execution nonce', async () => {
        expect(await sdk.addKeys(identityAddress, [otherWallet.address, otherWallet2.address], privateKey, {...addKeyDetails, gasToken: mockToken.address})).to.eq(0);
      });
    });

    describe('Identity Exists', async () => {
      it('should return correct bytecode', async () => {
        const address = await sdk.resolveName('alex.mylogin.eth');
        expect(Identity.runtimeBytecode.slice(0, 14666)).to.eq((await provider.getCode(address)).slice(2, 14668));
      });

      it('shoul return false if no resolver address', async () => {
        expect(await sdk.resolveName('no-such-login.mylogin.eth')).to.be.false;
      });

      it('should get correct address', async () => {
        expect(await sdk.resolveName('alex.mylogin.eth')).to.eq(identityAddress);
      });

      it('should return identity address if identity exist', async () => {
        expect(await sdk.identityExist('alex.mylogin.eth')).to.eq(identityAddress);
      });

      it('should return false if identity doesn`t exist', async () => {
        expect(await sdk.identityExist('no-such-login.mylogin.eth')).to.be.false;
      });

      describe('Authorisation', async () => {
        it('no pending authorisations', async () => {
          expect(await sdk.relayerObserver.fetchPendingAuthorisations(identityAddress)).to.deep.eq([]);
        });

        it('should return pending authorisations', async () => {
          const privateKey = await sdk.connect(identityAddress);
          const wallet = new ethers.Wallet(privateKey);
          const response = await sdk.relayerObserver.fetchPendingAuthorisations(identityAddress);
          expect(response[0]).to.deep.include({key: wallet.address});
        });

        it('should return private key', async () => {
          expect(await sdk.connect(identityAddress)).to.be.properPrivateKey;
        });

        it('should return public key when deny request', async () => {
          const privateKey = await sdk.connect(identityAddress);
          const wallet = new ethers.Wallet(privateKey);
          const response = await sdk.denyRequest(identityAddress, wallet.address);
          expect(response).to.eq(wallet.address);
        });
      });
    });
  });

  after(async () => {
    await relayer.stop();
  });
});
