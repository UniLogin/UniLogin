import chai, {expect} from 'chai';
import AuthorisationStore from '../../../../lib/integration/sql/services/AuthorisationStore';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {createKeyPair, TEST_GAS_PRICE} from '@universal-login/commons';
import {getKnexConfig} from '../../../helpers/knex';
import deviceInfo from '../../../config/defaults';
import setupWalletService, {createFutureWallet} from '../../../helpers/setupWalletService';


chai.use(require('chai-string'));

describe('INT: Authorisation Service', async () => {
  let authorisationStore;
  let wallet;
  let provider;
  let contractAddress;
  let otherWallet;

  const keyPair = createKeyPair();
  const ensName = 'justyna.mylogin.eth';

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    authorisationStore = new AuthorisationStore(getKnexConfig());
    const {walletService, factoryContract, ensService} = await setupWalletService(wallet);
    const {futureContractAddress, signature} = await createFutureWallet(keyPair, ensName, factoryContract, wallet, ensService);
    await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature});
    contractAddress = futureContractAddress;
  });

  it('Authorisation roundtrip', async () => {
    const request = {walletContractAddress: contractAddress, key: keyPair.publicKey, deviceInfo};

    const [id] = await authorisationStore.addRequest(request);
    const authorisations = await authorisationStore.getPendingAuthorisations(contractAddress);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});

    await authorisationStore.removeRequest(otherWallet.address, keyPair.publicKey);
    const authorisationsAfterDelete = await authorisationStore.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationStore.getPendingAuthorisations(contractAddress)).to.deep.eq([]);
  });

  afterEach(async () => {
    await authorisationStore.database.delete().from('authorisations');
    await authorisationStore.database.destroy();
  });
});
