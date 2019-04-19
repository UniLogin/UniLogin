import chai, {expect} from 'chai';
import AuthorisationService from '../../../lib/services/authorisationService';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import WalletService from '../../../lib/services/WalletService';
import buildEnsService from '../../helpers/buildEnsService';
import WalletContract from '@universal-login/contracts/build/Wallet';
import {waitForContractDeploy} from '@universal-login/commons';
import {EventEmitter} from 'fbemitter';
import {getKnex} from '../../../lib/utils/knexUtils';
import deviceInfo from '../../config/defaults';

chai.use(require('chai-string'));

describe('Authorisation Service', async () => {
  let authorisationService;
  let provider;
  let managementKey;
  let wallet;
  let ensDeployer;
  let ensService;
  let walletContractService;
  let walletContract;
  let otherWallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, managementKey, otherWallet, ensDeployer] = await getWallets(provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    const database = getKnex();
    authorisationService = new AuthorisationService(database);
    walletContractService = new WalletService(wallet, null, ensService, new EventEmitter(), true);
    const transaction = await walletContractService.create(managementKey.address, 'alex.mylogin.eth');
    walletContract = await waitForContractDeploy(managementKey, WalletContract, transaction.hash);
  });

  it('Authorisation roundtrip', async () => {
    const walletContractAddress =  walletContract.address;
    const key = managementKey.address.toLowerCase();
    const request = {walletContractAddress, key, deviceInfo};

    const [id] = await authorisationService.addRequest(request);
    const authorisations = await authorisationService.getPendingAuthorisations(walletContract.address);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});

    await authorisationService.removeRequest(otherWallet.address, managementKey.address.toLowerCase());
    const authorisationsAfterDelete = await authorisationService.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationService.getPendingAuthorisations(walletContract.address)).to.deep.eq([]);
  });

  afterEach(async () => {
    await authorisationService.database.delete().from('authorisations');
    await authorisationService.database.destroy();
  });
});
