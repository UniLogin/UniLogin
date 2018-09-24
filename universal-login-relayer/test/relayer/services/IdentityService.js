import chai, {expect} from 'chai';
import ethers, {utils, Interface} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import {MANAGEMENT_KEY, ECDSA_TYPE, ACTION_KEY} from 'universal-login-contracts';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';
import IdentityService from '../../../lib/services/IdentityService';
import {waitForContractDeploy, messageSignature, addressToBytes32} from '../../../lib/utils/utils';
import buildEnsService from '../../helpers/buildEnsService';
import AuthorisationService from '../../../lib/services/authorisationService';
chai.use(require('chai-string'));

describe('Relayer - IdentityService', async () => {
  let identityService;
  let ensService;
  let managementKey;
  let provider;
  let otherWallet;
  let ensDeployer;
  let authorisationService;
  const data = utils.hexlify(0);


  before(async () => {
    provider = createMockProvider();
    [managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    const wallet = new ethers.Wallet(defaultAccounts[0].secretKey, provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    authorisationService = new AuthorisationService();
    identityService = new IdentityService(wallet, ensService, authorisationService);
  });

  describe('IdentityService', async () => {
    let contract;

    before(async () => {
      const transaction = await identityService.create(managementKey.address, 'alex.mylogin.eth');
      contract = await waitForContractDeploy(managementKey, Identity, transaction.hash);
      await contract.setRequiredApprovals(0);
    });

    describe('Create', async () => {
      it('returns contract address', async () => {
        expect(contract.address).to.be.properAddress;
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
    });

    describe('Execute signed', async () => {
      let expectedBalance;
      const value = 10;

      before(async () => {
        await managementKey.send(contract.address, 100000);
        expectedBalance = (await otherWallet.getBalance()).add(value);
      });

      describe('Add Key', async () => {
        it('execute signed message', async () => {
          const to = otherWallet.address;
          const signature = messageSignature(managementKey, to, value, data);

          await identityService.executeSigned(contract.address, {to, value, data, signature});
          expect(await otherWallet.getBalance()).to.eq(expectedBalance);
        });

        it('execute add key', async () => {
          const newKeyAddress = addressToBytes32(otherWallet.address);
          const {data} = new Interface(Identity.interface).functions.addKey(newKeyAddress, ACTION_KEY, ECDSA_TYPE);
          const signature = messageSignature(managementKey, contract.address, 0, data);
          const message =  {to: contract.address, value: 0, data, signature};

          await identityService.executeSigned(contract.address, message);
          const key = await contract.getKey(newKeyAddress);
          expect(key.purpose).to.eq(ACTION_KEY);
        });

        describe('Collaboration with Authorisation Service', async () => {
          let message;
          before(async () => {
            const request = {identityAddress: contract.address, key: otherWallet.address, label: 'label'};
            await authorisationService.addRequest(request);

            const {data} = new Interface(Identity.interface).functions.addKey(addressToBytes32(otherWallet.address), MANAGEMENT_KEY, ECDSA_TYPE);
            const signature = messageSignature(managementKey, contract.address, 0, data);
            message =  {to: contract.address, value: 0, data, signature};
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
          const signature = messageSignature(managementKey, contract.address, 0, data);
          const message =  {to: contract.address, value: 0, data, signature};
          await identityService.executeSigned(contract.address, message);
        });

        it('should remove key', async () => {
          expect((await contract.getKey(addressToBytes32(ensDeployer.address)))[0]).to.eq(MANAGEMENT_KEY);
          const {data} = new Interface(Identity.interface).functions.removeKey(addressToBytes32(ensDeployer.address), MANAGEMENT_KEY);
          const signature = messageSignature(managementKey, contract.address, 0, data);
          const message =  {to: contract.address, value: 0, data, signature};
          await identityService.executeSigned(contract.address, message);
          expect((await contract.getKey(addressToBytes32(ensDeployer.address)))[0]).to.eq(0);
        });
      });
    });
  });
});
