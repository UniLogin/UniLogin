import {expect} from 'chai';
import sinon from 'sinon';
import {ETHER_NATIVE_TOKEN, TEST_CONTRACT_ADDRESS, TEST_KEY, TokenPricesService, TokenDetailsService, TEST_TOKEN_ADDRESS, TEST_TOKEN_DETAILS, TEST_ENS_NAME, TEST_GAS_PRICE} from '@unilogin/commons';
import {FutureWalletHandler} from '../../../src/core/services/FutureWalletHandler';
import {FutureWalletStore} from '../../../src/integration/sql/services/FutureWalletStore';
import getKnexConfig from '../../testhelpers/knex';
import {clearDatabase} from '../../../src/http/relayers/RelayerUnderTest';
import {MockProvider} from 'ethereum-waffle';

describe('INT: FutureWalletHandler', () => {
  const provider = new MockProvider();
  const knex = getKnexConfig();
  const futureWalletStore = new FutureWalletStore(knex);
  const tokenPricesService = new TokenPricesService();
  const tokenDetailsService = new TokenDetailsService(provider);
  const mockedGasTokenValidator = {validate: () => Promise.resolve()} as any;
  const futureWalletHandler = new FutureWalletHandler(futureWalletStore, tokenPricesService, tokenDetailsService, mockedGasTokenValidator);
  const addSpy = sinon.spy(futureWalletStore, 'add');

  before(() => {
    const getTokenDetailsStub = sinon.stub(tokenDetailsService, 'getTokenDetails').resolves(TEST_TOKEN_DETAILS[0]);
    getTokenDetailsStub.withArgs(ETHER_NATIVE_TOKEN.address).resolves(ETHER_NATIVE_TOKEN);
    const getTokenPriceInEthStub = sinon.stub(tokenPricesService, 'getTokenPriceInEth').withArgs(ETHER_NATIVE_TOKEN).resolves(1);
    getTokenPriceInEthStub.withArgs(TEST_TOKEN_DETAILS[0]).resolves(0.001);
  });

  it('creates future wallet', async () => {
    const futureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: TEST_ENS_NAME,
      gasPrice: TEST_GAS_PRICE,
      gasToken: ETHER_NATIVE_TOKEN.address,
    };
    const [contractAddress] = await futureWalletHandler.handle(futureWallet);
    expect(contractAddress).to.eq(futureWallet.contractAddress);
    expect(addSpy).to.be.calledWith({
      ...futureWallet,
      tokenPriceInETH: '1',
    });
  });

  it('creates future wallet in token', async () => {
    const futureWallet = {
      contractAddress: TEST_CONTRACT_ADDRESS,
      publicKey: TEST_KEY,
      ensName: TEST_ENS_NAME,
      gasPrice: TEST_GAS_PRICE,
      gasToken: TEST_TOKEN_ADDRESS,
    };
    const [contractAddress] = await futureWalletHandler.handle(futureWallet);
    expect(contractAddress).to.eq(futureWallet.contractAddress);
    expect(addSpy).to.be.calledWith({
      ...futureWallet,
      tokenPriceInETH: '0.001',
    });
  });

  afterEach(async () => {
    await clearDatabase(knex);
  });

  after(async () => {
    await knex.destroy();
  });
});
