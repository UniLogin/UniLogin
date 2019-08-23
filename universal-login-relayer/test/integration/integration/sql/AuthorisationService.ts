import chai, {expect} from 'chai';
import Knex from 'knex';
import {Wallet} from 'ethers';
import {getWallets, createMockProvider} from 'ethereum-waffle';
import {createKeyPair, TEST_GAS_PRICE} from '@universal-login/commons';
import AuthorisationStore from '../../../../lib/integration/sql/services/AuthorisationStore';
import {getKnexConfig} from '../../../helpers/knex';
import deviceInfo from '../../../config/defaults';
import setupWalletService, {createFutureWallet} from '../../../helpers/setupWalletService';

chai.use(require('chai-string'));

describe('INT: Authorisation Service', async () => {
  let authorisationStore: AuthorisationStore;
  let wallet: Wallet;
  let provider;
  let contractAddress: string;
  let otherWallet: Wallet;
  let database: Knex;
  const keyPair = createKeyPair();
  const ensName = 'justyna.mylogin.eth';

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    database = getKnexConfig();
    authorisationStore = new AuthorisationStore(database);
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
    await database.delete().from('authorisations');
    await database.destroy();
  });
});
