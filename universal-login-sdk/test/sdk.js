import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import EthereumIdentitySDK from '../lib/sdk';
import {RelayerUnderTest} from 'universal-login-relayer';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import ethers, {utils} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import DEFAULT_PAYMENT_OPTIONS from '../lib/config';

chai.use(solidity);
chai.use(sinonChai);

const {gasToken, gasPrice, gasLimit} = DEFAULT_PAYMENT_OPTIONS;

describe('SDK - integration', async () => {
  let provider;
  let relayer;
  let sdk;
  let otherWallet;
  let otherWallet2;
  let sponsor;

  before(async () => {
    provider = createMockProvider();
    [otherWallet, sponsor, otherWallet2] = await getWallets(provider);
    relayer = await RelayerUnderTest.createPreconfigured(provider);
    await relayer.start();
    ({provider} = relayer);
    sdk = new EthereumIdentitySDK(relayer.url(), provider);
  });

  describe('Create', async () => {
    let privateKey;
    let identityAddress;

    before(async () => {
      [privateKey, identityAddress] = await sdk.create('alex.mylogin.eth');
      sponsor.send(identityAddress, 10000);
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
      let message;

      before(async () => {
        message = {
          to: otherWallet.address,
          value: 10,
          data: utils.hexlify(0),
          nonce: 0,
          gasToken,
          gasPrice,
          gasLimit
        };
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
    });

    describe('Add key', async () => {
      const transactionDetalis = {
        nonce: 0,
        gasToken,
        gasPrice,
        gasLimit
      };
      it('should return execution nonce', async () => {
        expect(await sdk.addKey(identityAddress, otherWallet.address, privateKey, transactionDetalis)).to.eq(2);
      });
    });

    describe('Add keys', async () => {
      const transactionDetalis = {
        nonce: 0,
        gasToken,
        gasPrice,
        gasLimit
      };
      it('should return execution nonce', async () => {
        expect(await sdk.addKeys(identityAddress, [otherWallet.address, otherWallet2.address], privateKey, transactionDetalis)).to.eq(3);
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
