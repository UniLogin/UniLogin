import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ethers from 'ethers';
import {lookupAddress} from '../../../lib/utils/utils';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';
import CounterfactualIdentityService from '../../../lib/services/counterfactualIdentityService';
import buildEnsService from '../../helpers/buildEnsService';
import AuthorisationService from '../../../lib/services/authorisationService';
import {EventEmitter} from 'fbemitter';

chai.use(require('chai-string'));
chai.use(sinonChai);

describe('Relayer - counterfactual identity service', async () => {
  let counterfactualIdentityService;
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
    counterfactualIdentityService = new CounterfactualIdentityService(wallet, ensService, authorisationService, hooks, provider);
  });

  describe('IdentityService', async () => {
    let contract;
    let callback;
    let counterfactualData;

    before(async () => {
      callback = sinon.spy();
      hooks.addListener('AddressGenerated', callback);
      counterfactualData = await counterfactualIdentityService.create(managementKey.address, 'alex.mylogin.eth');
    });

    it('returns contract address', async () => {
      expect(counterfactualData.contractAddress).to.be.properAddress;
      expect(counterfactualData.deployer).to.be.properAddress;
    });

    it('should emit created event', async () => {
      expect(callback).to.be.calledWith(sinon.match({address: counterfactualData.contractAddress}));
    });

    it('should return false on not deployed contract', async () => {

      const isDeployed = await counterfactualIdentityService.isContractDeployed(counterfactualData.contractAddress);

      expect(isDeployed).to.be.false;

    });

    it('should deploy contract', async () => {

      await counterfactualIdentityService.deployProxy(counterfactualData);

      expect(await provider.resolveName('alex.mylogin.eth')).to.eq(counterfactualData.contractAddress);

    });

    it('should return true on deployed contract', async () => {

      const isDeployed = await counterfactualIdentityService.isContractDeployed(counterfactualData.contractAddress);

      expect(isDeployed).to.be.true;

    });

  });
});
