import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ethers, {utils, Interface} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import {MANAGEMENT_KEY, ECDSA_TYPE, ACTION_KEY} from 'universal-login-contracts';
import {defaultAccounts, getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import IdentityService from '../../../lib/services/IdentityService';
import {messageSignature, addressToBytes32} from '../../../lib/utils/utils';
import buildEnsService from '../../helpers/buildEnsService';
import AuthorisationService from '../../../lib/services/authorisationService';
import {EventEmitter} from 'fbemitter';
import MockToken from 'universal-login-contracts/build/MockToken';
import defaultPaymentOptions from '../../../lib/config/defaultPaymentOptions';

chai.use(require('chai-string'));
chai.use(sinonChai);

describe('Relayer - IdentityService', async () => {
  let identityService;
  let ensService;
  let managementKey;
  let provider;
  let otherWallet;
  let ensDeployer;
  let authorisationService;
  let hooks;
  let wallet;

  before(async () => {
    provider = createMockProvider();
    [managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    wallet = new ethers.Wallet(defaultAccounts[0].secretKey, provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    hooks = new EventEmitter();
    authorisationService = new AuthorisationService();
    identityService = new IdentityService(wallet, ensService, authorisationService, hooks, provider);
  });

  describe('IdentityService', async () => {
    let contract;
    let callback;
    let transaction;
    let contractAddress;

    before(async () => {
      callback = sinon.spy();
      hooks.addListener('AddressGenerated', callback);
      transaction = await identityService.create(managementKey.address, 'alex.mylogin.eth');
      contractAddress = transaction.address;
    });

    describe('Create', async () => {
      it('returns contract address', async () => {
        expect(contractAddress).to.be.properAddress;
      });

      it('should emit created event', async () => {
        expect(callback).to.be.calledWith(sinon.match(transaction));
      });
    });

    describe('Execute signed', async () => {
      let expectedBalance;
      const value = 10;
      let token;
      const {gasPrice, gasLimit} = defaultPaymentOptions;

      before(async () => {
        await managementKey.send(contractAddress, utils.parseEther('12'));
        expectedBalance = (await otherWallet.getBalance()).add(value);
        token = await deployContract(wallet, MockToken, []);
        contract = new ethers.Contract(contractAddress, Identity.interface, managementKey);
      });

      describe('Add Key', async () => {
        before(async () => {
          await token.transfer(contract.address, utils.parseEther('50'));
        });

        it('execute signed message', async () => {
          const to = otherWallet.address;
          const signature = messageSignature(managementKey, to, contract.address, value, utils.hexlify(0), 0, token.address, gasPrice, gasLimit);
          await identityService.executeSigned(contract.address, {to, value, data: utils.hexlify(0), nonce: 0, gasToken: token.address, gasPrice, gasLimit, signature});

          expect(await otherWallet.getBalance()).to.eq(expectedBalance);
        });

        it('is initialized with management key', async () => {
          const managementKeys = await contract.getKeysByPurpose(MANAGEMENT_KEY);
          const expectedKey = managementKey.address.slice(2).toLowerCase();
          expect(managementKeys).to.have.lengthOf(1);
          expect(managementKeys[0]).to.endsWith(expectedKey);
        });

        it('has ENS name reserved', async () => {
          expect(await provider.resolveName('alex.mylogin.eth')).to.eq(contract.address);
        });

        it('Error when not enough tokens', async () => {
          const signature = messageSignature(managementKey, otherWallet.address, contract.address, value, utils.hexlify(0), 0, token.address, gasPrice, utils.parseEther('51'));
          expect(identityService.executeSigned(contract.address, {to: otherWallet.address, value, data: utils.hexlify(0), nonce: 0, gasToken: token.address, gasPrice, gasLimit: utils.parseEther('51'), signature})).to.be.eventually.rejected;
        });

        it('execute add key', async () => {
          const newKeyAddress = addressToBytes32(otherWallet.address);
          const {data} = new Interface(Identity.interface).functions.addKey(newKeyAddress, ACTION_KEY, ECDSA_TYPE);
          const signature = messageSignature(managementKey, contract.address, contract.address, 0, data, 1, token.address, gasPrice, gasLimit);
          const message = {to: contract.address, value: 0, data, nonce: 1, gasToken: token.address, gasPrice, gasLimit, signature};

          await identityService.executeSigned(contract.address, message);
          const key = await contract.getKey(newKeyAddress);
          expect(key.purpose).to.eq(ACTION_KEY);
        });

        describe('Collaboration with Authorisation Service', async () => {
          let message;
          before(async () => {
            await contract.setRequiredApprovals(0);
            const request = {identityAddress: contract.address, key: otherWallet.address, label: 'lol'};
            await authorisationService.addRequest(request);

            const {data} = new Interface(Identity.interface).functions.addKey(addressToBytes32(otherWallet.address), MANAGEMENT_KEY, ECDSA_TYPE);
            const signature = messageSignature(managementKey, contract.address, contract.address, 0, data, 2, token.address, gasPrice, gasLimit);
            message = {to: contract.address, value: 0, data, nonce: 2, gasToken: token.address, gasPrice, gasLimit, signature};
          });

          it('should remove request from pending authorisations if addKey', async () => {
            await identityService.executeSigned(contract.address, message);
            expect(await authorisationService.getPendingAuthorisations(contract.address)).to.deep.eq([]);
          });
        });
      });

      describe('Remove key ', async () => {
        before(async () => {
          const {data} = new Interface(Identity.interface).functions.addKey(addressToBytes32(ensDeployer.address), MANAGEMENT_KEY, ECDSA_TYPE);
          const signature = messageSignature(managementKey, contract.address, contract.address, 0, data, 3, token.address, gasPrice, gasLimit);
          const message = {to: contract.address, value: 0, data, nonce: 3, gasToken: token.address, gasPrice, gasLimit, signature};
          await identityService.executeSigned(contract.address, message);
        });

        it('should remove key', async () => {
          expect((await contract.getKey(addressToBytes32(ensDeployer.address)))[0]).to.eq(MANAGEMENT_KEY);
          const {data} = new Interface(Identity.interface).functions.removeKey(addressToBytes32(ensDeployer.address), MANAGEMENT_KEY);
          const signature = messageSignature(managementKey, contract.address, contract.address, 0, data, 4, token.address, gasPrice, gasLimit);
          const message = {to: contract.address, value: 0, data, nonce: 4, gasToken: token.address, gasPrice, gasLimit, signature};
          await identityService.executeSigned(contract.address, message);
          expect((await contract.getKey(addressToBytes32(ensDeployer.address)))[0]).to.eq(0);
        });
      });
    });
  });
});
