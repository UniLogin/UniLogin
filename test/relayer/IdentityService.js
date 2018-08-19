import chai from 'chai';
import Identity from '../../build/Identity';
import ethers from 'ethers';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';
import IdentityService from '../../lib/relayer/services/IdentityService';
import {MANAGEMENT_KEY} from '../../lib/sdk/sdk';

chai.use(require('chai-string'));

const {expect} = chai;

describe('Relayer - IdentityService', async () => {
  let identityService;
  let managementKey;
  let provider;

  before(async () => {
    [managementKey] = await getWallets(provider);
    provider = createMockProvider();
    const wallet = new ethers.Wallet(defaultAccounts[0].secretKey, provider);
    identityService = new IdentityService(wallet);
  });

  describe('create identity', async () => {
    let identityContractAddress;

    before(async () => {
      identityContractAddress = await identityService.create(managementKey.address);
    });

    it('returns contract address', async () => {
      expect(identityContractAddress).to.be.properAddress;
    });

    it('is initialized with management key', async () => {
      const contract = new ethers.Contract(identityContractAddress, Identity.interface, provider);
      const managementKeys = await contract.getKeysByPurpose(MANAGEMENT_KEY);
      const expectedKey = managementKey.address.slice(2).toLowerCase();
      expect(managementKeys).to.have.lengthOf(1);
      expect(managementKeys[0]).to.endsWith(expectedKey);
    });
  });
});

