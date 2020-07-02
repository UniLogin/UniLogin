import chai, {expect} from 'chai';
import Knex from 'knex';
import {Wallet} from 'ethers';
import {MockProvider} from 'ethereum-waffle';
import {createKeyPair, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN, EMPTY_DEVICE_INFO} from '@unilogin/commons';
import setupWalletService, {createFutureWalletUsingEnsService} from '../../testhelpers/setupWalletService';
import AuthorisationStore from '../../../src/integration/sql/services/AuthorisationStore';
import {getKnexConfig} from '../../testhelpers/knex';
import deviceInfo from '../../testconfig/defaults';

chai.use(require('chai-string'));

describe('INT: Authorisation Store', () => {
  let authorisationStore: AuthorisationStore;
  let wallet: Wallet;
  let provider;
  let contractAddress: string;
  let otherWallet: Wallet;
  let database: Knex;
  let signature: string;
  const keyPair = createKeyPair();
  const ensName = 'justyna.mylogin.eth';

  beforeEach(async () => {
    provider = new MockProvider();
    [wallet, otherWallet] = provider.getWallets();
    database = getKnexConfig();
    authorisationStore = new AuthorisationStore(database);
    const {walletService, factoryContract, ensService, ensRegistrar, gnosisSafeMaster: walletContract, fallbackHandler} = await setupWalletService(wallet);
    ({contractAddress, signature} = await createFutureWalletUsingEnsService(keyPair, ensName, factoryContract, wallet, ensService, ensRegistrar.address, walletContract.address, fallbackHandler.address));
    await walletService.deploy({publicKey: keyPair.publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature, gasToken: ETHER_NATIVE_TOKEN.address}, EMPTY_DEVICE_INFO);
  });

  it('Authorisation roundtrip', async () => {
    const request = {walletContractAddress: contractAddress, key: keyPair.publicKey, deviceInfo};
    const [id] = await authorisationStore.addRequest(request);
    const authorisations = await authorisationStore.getPendingAuthorisations(contractAddress);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});

    await authorisationStore.removeRequests(otherWallet.address);
    const authorisationsAfterDelete = await authorisationStore.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('Authorisation add-remove roundtrip', async () => {
    const request = {walletContractAddress: contractAddress, key: keyPair.publicKey, deviceInfo};
    await authorisationStore.addRequest(request);
    const authorisations = await authorisationStore.getPendingAuthorisations(contractAddress);
    expect(authorisations).length(1);
    const itemToRemove = await authorisationStore.get(contractAddress, keyPair.publicKey);
    const removedItemsCount = await authorisationStore.removeRequest(contractAddress, keyPair.publicKey);
    expect(itemToRemove).to.deep.eq(request);
    expect(removedItemsCount).to.eq(1);
  });

  it('Remove non-existing item', async () => {
    const removedItemsCount = await authorisationStore.removeRequest(contractAddress, keyPair.publicKey);
    expect(removedItemsCount).to.eq(0);
  });

  it('Many authorisation requests roundtrip', async () => {
    const requests = [1, 2, 3].map((_) => ({walletContractAddress: contractAddress, key: createKeyPair().publicKey, deviceInfo}));
    const ids = [];
    for (const request of requests) {
      const [id] = await authorisationStore.addRequest(request);
      ids.push(id);
    }

    const authorisations = await authorisationStore.getPendingAuthorisations(contractAddress);
    expect(authorisations.length).to.eq(3);
    expect(authorisations[0]).to.deep.eq({...requests[0], id: ids[0]});
    expect(authorisations[1]).to.deep.eq({...requests[1], id: ids[1]});
    expect(authorisations[2]).to.deep.eq({...requests[2], id: ids[2]});

    await authorisationStore.removeRequests(otherWallet.address);
    const authorisationsAfterDelete = await authorisationStore.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationStore.getPendingAuthorisations(contractAddress)).to.deep.eq([]);
  });

  afterEach(async () => {
    await database('authorisations').del();
    await database.destroy();
  });
});
