import {getKnexConfig} from '../../testhelpers/knex';
import {TEST_CONTRACT_ADDRESS, TEST_STORED_FUTURE_WALLET} from '@unilogin/commons';
import {FutureWalletStore} from '../../../src/integration/sql/services/FutureWalletStore';
import {expect} from 'chai';

describe('UNIT: FutureWalletStore', () => {
  const knex = getKnexConfig();
  const futureWalletStore = new FutureWalletStore(knex);

  it('Should add futureWallet to database and get tokenPriceInETH', async () => {
    const [contractAddress] = await futureWalletStore.add(TEST_STORED_FUTURE_WALLET);
    expect(contractAddress).be.deep.eq(TEST_CONTRACT_ADDRESS);
    expect(await futureWalletStore.get(contractAddress)).be.deep.eq(TEST_STORED_FUTURE_WALLET);
    expect(await futureWalletStore.getByEnsName(TEST_STORED_FUTURE_WALLET.ensName)).be.deep.eq(TEST_STORED_FUTURE_WALLET);
  });
});
