import {getKnexConfig} from '../../testhelpers/knex';
import {TEST_CONTRACT_ADDRESS, ETHER_NATIVE_TOKEN, TEST_KEY} from '@unilogin/commons';
import {FutureWalletStore} from '../../../src/integration/sql/services/FutureWalletStore';
import {expect} from 'chai';

describe('UNIT: FutureWalletStore', () => {
  const knex = getKnexConfig();
  const futureWalletStore = new FutureWalletStore(knex);

  it('Should add futureWallet to database and get tokenPriceInETH', async () => {
    const mockedTokenPriceInETH = '0.7';
    const storedFutureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: 'name.mylogin.eth',
      gasPrice: '1',
      gasToken: ETHER_NATIVE_TOKEN.address,
      tokenPriceInETH: mockedTokenPriceInETH,
    };

    const [contractAddress] = await futureWalletStore.add(storedFutureWallet);
    expect(contractAddress).be.deep.eq(TEST_CONTRACT_ADDRESS);
    const {tokenPriceInETH} = await futureWalletStore.getGasPriceInETH(contractAddress);
    expect(tokenPriceInETH).be.deep.eq(mockedTokenPriceInETH);
  });
});
