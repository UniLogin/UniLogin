import chai, {expect} from 'chai';
import AuthorisationStore from '../../../../lib/integration/sql/services/AuthorisationStore';
import {getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import WalletService from '../../../../lib/integration/ethereum/WalletService';
import buildEnsService from '../../../helpers/buildEnsService';
import {waitForContractDeploy, createKeyPair} from '@universal-login/commons';
import {EventEmitter} from 'fbemitter';
import {getKnexConfig} from '../../../helpers/knex';
import deviceInfo from '../../../config/defaults';
import {deployFactory} from '@universal-login/contracts';


chai.use(require('chai-string'));

describe('INT: Authorisation Service', async () => {
  let authorisationStore;
  let wallet;
  let ensDeployer;
  let ensService;
  let walletContractService;
  let walletContractAddress;
  let otherWallet;
  const keyPair = createKeyPair();

  beforeEach(async () => {
    const provider = createMockProvider();
    [wallet, otherWallet, ensDeployer] = await getWallets(provider);
    [ensService, provider] = await buildEnsService(ensDeployer, 'mylogin.eth');
    const walletMasterContract = await deployContract(ensDeployer, WalletMaster);
    const factoryContract = await deployFactory(wallet, walletMasterContract.address);
    authorisationStore = new AuthorisationStore(getKnexConfig());
    const config = {walletMasterAddress: walletMasterContract.address, factoryAddress: factoryContract.address};
    walletContractService = new WalletService(wallet, config, ensService, new EventEmitter());
    const transaction = await walletContractService.create(keyPair.publicKey, 'alex.mylogin.eth');
    walletContractAddress = (await waitForContractDeploy(wallet, WalletMaster, transaction.hash)).address;
  });

  it('Authorisation roundtrip', async () => {
    const request = {walletContractAddress, key: keyPair.publicKey, deviceInfo};

    const [id] = await authorisationStore.addRequest(request);
    const authorisations = await authorisationStore.getPendingAuthorisations(walletContractAddress);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});

    await authorisationStore.removeRequest(otherWallet.address, keyPair.publicKey);
    const authorisationsAfterDelete = await authorisationStore.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationStore.getPendingAuthorisations(walletContractAddress)).to.deep.eq([]);
  });

  afterEach(async () => {
    await authorisationStore.database.delete().from('authorisations');
    await authorisationStore.database.destroy();
  });
});
