import chai from 'chai';
import Identity from '../../../build/Identity';
import ethers, {utils} from 'ethers';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';
import IdentityService from '../../../lib/services/IdentityService';
import {MANAGEMENT_KEY} from '../../../lib/const';
import {waitForContractDeploy, messageSignature} from '../../../lib/utils/utils';
import buildEnsService from '../../helpers/buildEnsService';
chai.use(require('chai-string'));

const {expect} = chai;

describe('Relayer - IdentityService', async () => {
  let identityService;
  let ensService;
  let managementKey;
  let provider;
  let otherWallet;
  let ensDeployer;
  const data = utils.hexlify(0);


  before(async () => {
    provider = createMockProvider();
    [managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    const wallet = new ethers.Wallet(defaultAccounts[0].secretKey, provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    identityService = new IdentityService(wallet, ensService);
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

      it('execute signed message', async () => {
        const to = otherWallet.address;
        const signature = messageSignature(managementKey, to, value, data);
        await identityService.executeSigned(contract.address, {to, value, data, signature});
        expect(await otherWallet.getBalance()).to.eq(expectedBalance);
      });
    });
  });
});
