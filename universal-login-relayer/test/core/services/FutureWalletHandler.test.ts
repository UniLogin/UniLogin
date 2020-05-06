import {expect} from 'chai';
import {ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TEST_KEY, TokenPricesService} from '@unilogin/commons';
import {FutureWalletHandler} from '../../../src/core/services/FutureWalletHandler';
import {FutureWalletStore} from '../../../src/integration/sql/services/FutureWalletStore';
import getKnexConfig from '../../testhelpers/knex';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';

describe('INT: FutureWalletHandler', () => {
  const knex = getKnexConfig();
  const futureWalletStore = new FutureWalletStore(knex);
  const tokenPricesService = new TokenPricesService();
  const futureWalletHandler = new FutureWalletHandler(futureWalletStore, tokenPricesService);

  it('creates future wallet', async () => {
    const futureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: 'name.mylogin.eth',
      gasPrice: '1',
      gasToken: ETHER_NATIVE_TOKEN.address,
    };
    const [contractAddress] = await futureWalletHandler.handle(futureWallet);
    expect(contractAddress).to.eq(futureWallet.contractAddress);
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
