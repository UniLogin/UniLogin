import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, getWallets, solidity, deployContract} from 'ethereum-waffle';
import ethers, {utils} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import MockToken from 'universal-login-contracts/build/MockToken';
import DEFAULT_PAYMENT_OPTIONS from '../lib/config';
import {OPERATION_CALL} from 'universal-login-contracts';

chai.use(solidity);
chai.use(sinonChai);

const {gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('SDK - integration', async () => {
  let provider;
  let relayer;
  let sdk;
  let otherWallet;
  let otherWallet2;
  let sponsor;
  let token;
  let message;

  before(async () => {
    provider = createMockProvider();
    [otherWallet, sponsor, otherWallet2] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
    token = await deployContract(sponsor, MockToken, []);
    message = {
      to: otherWallet.address,
      value: 10,
      data: utils.hexlify(0),
      gasToken: token.address,
      gasPrice,
      gasLimit,
      operationType: OPERATION_CALL
    };
  });

  describe('Create', async () => {
    let privateKey;
    let identityAddress;

    before(async () => {
      [privateKey, identityAddress] = await sdk.create('alex.mylogin.eth');
      await sponsor.send(identityAddress, 10000);
      await token.transfer(identityAddress, utils.parseEther('20'));
    });

    describe('Initalization', () => {
      it('should return proper private key and address', async () => {
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

      xit('should throw InvalidENS exception if invalid ENS name');
    });

    describe('Execute signed message', async () => {
      let expectedBalance;
      let nonce;

      before(async () => {
        expectedBalance = (await otherWallet.getBalance()).add(10);
        nonce = await sdk.execute(identityAddress, message, privateKey);
      });

      it('Should execute signed message', async () => {
        expect(await otherWallet.getBalance()).to.eq(expectedBalance);
      });

      it('Should return 0 as first nonce', () => {
        expect(nonce).to.eq(0);
      });

      it('Should return 1 as second nonce', async () => {
        expect(await sdk.execute(identityAddress, message, privateKey)).to.eq(1);
      });

      it('No tokens', async () => {
        message = {
          to: otherWallet.address,
          value: 10,
          data: utils.hexlify(0),
          gasToken: token.address,
          gasPrice,
          gasLimit: utils.parseEther('25').toString() 
        };
        expect(sdk.execute(identityAddress, message, privateKey)).to.be.eventually.rejected;
      });
    });

    describe('Add key', async () => {
      it('should return execution nonce', async () => {
        expect(await sdk.addKey(identityAddress, otherWallet.address, privateKey, {gasToken: token.address, gasPrice, gasLimit})).to.eq(2);
      });
    });

    describe('Last execution nonce', async () => {
      it('should return correct execution nonce', async () => {
        const wallet = new ethers.Wallet(privateKey, provider);
        const executionNonce = await sdk.getLastNonce(identityAddress, wallet);
        expect(executionNonce).to.eq(3);
        await sdk.addKey(identityAddress, otherWallet.address, privateKey, {gasToken: token.address, gasPrice, gasLimit});
        expect(await sdk.getLastNonce(identityAddress, wallet)).to.eq(executionNonce.add(1));
      });
    });

    describe('Add keys', async () => {
      it('should return execution nonce', async () => {
        expect(await sdk.addKeys(identityAddress, [otherWallet.address, otherWallet2.address], privateKey, {gasToken: token.address, gasPrice, gasLimit})).to.eq(4);
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
          expect(response[0]).to.deep.include({key: wallet.address, label: ''});
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
