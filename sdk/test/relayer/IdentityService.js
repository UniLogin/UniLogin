import chai from 'chai';
import Identity from '../../build/Identity';
import ethers, {utils} from 'ethers';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';
import IdentityService from '../../lib/relayer/services/IdentityService';
import {MANAGEMENT_KEY} from '../../lib/sdk/sdk';
import {waitForContractDeploy, messageSignature} from '../../lib/utils/utils';
import ENSBuilder from '../../lib/utils/ensBuilder';

chai.use(require('chai-string'));

const {expect} = chai;

describe('Relayer - IdentityService', async () => {
  let identityService;
  let managementKey;
  let provider;
  let providerWithEns;
  let otherWallet;
  let ensDeployer;
  let ensBuilder;
  const data = utils.hexlify(0);

  before(async () => {
    provider = createMockProvider();
    [managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    const wallet = new ethers.Wallet(defaultAccounts[0].secretKey, provider);
    identityService = new IdentityService(wallet);

    ensBuilder = new ENSBuilder(ensDeployer);
    providerWithEns = await ensBuilder.bootstrapWith('test', 'eth');
  });

  describe('IdentityService', async () => {
    let contract;

    before(async () => {
      const transaction = await identityService.create(managementKey.address);
      contract = await waitForContractDeploy(managementKey, Identity, transaction.hash);
      await contract.setRequiredApprovals(0);
      await ensBuilder.registerAddress('john', 'test.eth', contract.address);
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
        expect(await providerWithEns.resolveName('john.test.eth')).to.eq(contract.address);
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
