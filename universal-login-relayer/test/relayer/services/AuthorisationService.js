import chai, {expect} from 'chai';
import AuthorisationService from '../../../lib/services/authorisationService';
import {getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import IdentityService from '../../../lib/services/IdentityService';
import CounterfactualIdentityService from '../../../lib/services/CounterfactualIdentityService';
import CounterfactualTransactionsService from '../../../lib/services/CounterfactualTransactionsService';
import buildEnsService from '../../helpers/buildEnsService';
import Identity from 'universal-login-contracts/build/Identity';
import {EventEmitter} from 'fbemitter';
import ethers, {utils} from 'ethers';
import MockToken from 'universal-login-contracts/build/MockToken';
import defaultPaymentOptions from '../../../lib/config/defaultPaymentOptions';
import {messageSignature} from '../../../lib/utils/utils';

chai.use(require('chai-string'));

describe('Authorisation Service', async () => {
  let authorisationService;
  let counterfactualIdentityService;
  let counterfactualTransactionsService;
  let provider;
  let managementKey;
  let wallet;
  let ensDeployer;
  let ensService;
  let identityService;
  let identityContract;
  let otherWallet;
  let request;
  let hooks;
  let token;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    hooks = new EventEmitter();
    authorisationService = new AuthorisationService();
    counterfactualIdentityService = new CounterfactualIdentityService(wallet, ensService, authorisationService, hooks, provider);
    counterfactualTransactionsService = new CounterfactualTransactionsService();
    identityService = new IdentityService(wallet, ensService, authorisationService, hooks, provider, counterfactualIdentityService, counterfactualTransactionsService);

    const transaction = await identityService.create(managementKey.address, 'alex.mylogin.eth');
    token = await deployContract(wallet, MockToken, []);
    await managementKey.send(transaction.address, utils.parseEther('4'));
    await token.transfer(transaction.address, utils.parseEther('50'));

    const value = 10;
    const {gasPrice, gasLimit} = defaultPaymentOptions;
    const to = otherWallet.address;
    const signature = messageSignature(managementKey, to, transaction.address, value, utils.hexlify(0), 0, token.address, gasPrice, gasLimit);
    await identityService.executeSigned(transaction.address, {to, value, data: utils.hexlify(0), nonce: 0, gasToken: token.address, gasPrice, gasLimit, signature});
    identityContract = new ethers.Contract(transaction.address, Identity.interface, managementKey);
    request = {
      identityAddress: identityContract.address,
      key: otherWallet.address,
      label: ' '
    };
    authorisationService.addRequest(request);
  });

  it('should add pending authorisation', async () => {
    const {key, label} = request;
    expect(await authorisationService.pendingAuthorisations[identityContract.address]).to.deep.eq([{key, label, index: 0}]);
  });

  it('should return pending authorisations', async () => {
    const {key, label} = request;
    expect(await authorisationService.getPendingAuthorisations(identityContract.address)).to.deep.eq([{key, label, index: 0}]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationService.getPendingAuthorisations(otherWallet.address)).to.deep.eq([]);
  });

  it('should return 2 pending authorisations', async () => {
    const secondRequest = {
      identityAddress: identityContract.address,
      key: otherWallet.address,
      label: ' '
    };
    const {key, label} = request;
    const key2 = secondRequest.key;
    const label2 = secondRequest.label;
    authorisationService.addRequest(secondRequest);
    expect(await authorisationService.pendingAuthorisations[identityContract.address]).to.deep.eq([{key, label, index: 0}, {key: key2, label: label2, index: 1}]);
  });

  describe('Indexes', async () => {
    let pendingAuthorisations;
    before(async () => {
      await authorisationService.addRequest(request);
      await authorisationService.addRequest(request);
      pendingAuthorisations = await authorisationService.pendingAuthorisations[identityContract.address];
    });

    it('should add indexes', async () => {
      expect(pendingAuthorisations[0].index).to.eq(0);
      expect(pendingAuthorisations[1].index).to.eq(1);
      expect(pendingAuthorisations[2].index).to.eq(2);
    });
  });

  describe('Pending authorisations', async () => {
    it('should remove request from pending authorisations', async () => {
      const {key} = request;
      await authorisationService.removeRequest(identityContract.address, key);
      expect(await authorisationService.pendingAuthorisations[identityContract.address]).to.deep.eq([]);
    });

    it('2 pending authorisations', async () => {
      const {key} = request;
      await authorisationService.addRequest({identityAddress: identityContract.address, key: managementKey.address, label: ' '});
      await authorisationService.removeRequest(identityContract.address, key);
      expect(await authorisationService.pendingAuthorisations[identityContract.address]).to.deep.eq([{key: managementKey.address, label: ' ', index: 1}]);
    });

    it('should remove correct pending authorisations', async () => {
      await authorisationService.addRequest({identityAddress: identityContract.address, key: managementKey.address, label: ' '});
      await authorisationService.addRequest({identityAddress: identityContract.address, key: ensDeployer.address, label: ' '});
      await authorisationService.addRequest({identityAddress: identityContract.address, key: wallet.address, label: ' '});
      await authorisationService.removeRequest(identityContract.address, ensDeployer.address);
      expect(await authorisationService.pendingAuthorisations[identityContract.address]).to.not.include([{key: ensDeployer.address, label: ' ', index: 2}]);
    });
  });
});
