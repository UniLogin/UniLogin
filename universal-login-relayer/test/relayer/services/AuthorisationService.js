import chai, {expect} from 'chai';
import AuthorisationService from '../../../lib/services/authorisationService';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import IdentityService from '../../../lib/services/IdentityService';
import buildEnsService from '../../helpers/buildEnsService';
import Identity from 'universal-login-contracts/build/Identity';
import {waitForContractDeploy} from '../../../lib/utils/utils';
import {EventEmitter} from 'fbemitter';
import {getKnex} from '../../../lib/utils/knexUtils';
import defaultDeviceInfo from '../../config/defaults';

chai.use(require('chai-string'));

describe('Authorisation Service', async () => {
  let authorisationService;
  let provider;
  let managementKey;
  let wallet;
  let ensDeployer;
  let ensService;
  let identityService;
  let identityContract;
  let otherWallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    const database = getKnex();
    authorisationService = new AuthorisationService(database);
    identityService = new IdentityService(wallet, ensService, authorisationService, new EventEmitter(), provider, {legacyENS: true});
    const transaction = await identityService.create(managementKey.address, 'alex.mylogin.eth');
    identityContract = await waitForContractDeploy(managementKey, Identity, transaction.hash);
  });

  it('add record to database', async () => {
    const request = {identityAddress: identityContract.address, key: managementKey.address.toLowerCase(), deviceInfo: defaultDeviceInfo};
    const [id] = await authorisationService.addRequest(request);
    const authorisations = await authorisationService.getPendingAuthorisations(identityContract.address);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});
  });

  it('should return pending authorisations', async () => {
    const request = {identityAddress: identityContract.address, key: otherWallet.address.toLowerCase(), deviceInfo: defaultDeviceInfo};
    const [id] = await authorisationService.addRequest(request);
    const authorisations = await authorisationService.getPendingAuthorisations(identityContract.address);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationService.getPendingAuthorisations(ensDeployer.address)).to.deep.eq([]);
  });

  it('should remove from database', async () => {
    const request = {identityAddress: otherWallet.address, key: managementKey.address.toLowerCase(), deviceInfo: defaultDeviceInfo};
    const [id] = await authorisationService.addRequest(request);
    const authorisations = await authorisationService.getPendingAuthorisations(otherWallet.address);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});
    await authorisationService.removeRequest(otherWallet.address, managementKey.address.toLowerCase());
    const authorisationsAfterDelete = await authorisationService.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete.length).to.eq(authorisations.length - 1);
  });

  afterEach(async () => {
    await authorisationService.database.delete().from('authorisations');
    authorisationService.database.destroy();
  });
});
