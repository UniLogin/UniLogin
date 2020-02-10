import {expect} from 'chai';
import {Contract} from 'ethers';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TokenDetailsService} from '@universal-login/commons';
import {mockContracts} from '@universal-login/contracts/testutils';
import {TokensDetailsStore} from '../../../src/core/services/TokensDetailsStore';

describe('INT: TokensDetailsStore', () => {
  let mockToken: Contract;
  let tokensDetailsStore: TokensDetailsStore;
  let tokenDetailsService: TokenDetailsService;

  before(async () => {
    const provider = createMockProvider();
    const [wallet] = getWallets(provider);
    mockToken = await deployContract(wallet, mockContracts.MockToken, []);
    tokenDetailsService = new TokenDetailsService(provider);
    tokensDetailsStore = new TokensDetailsStore(tokenDetailsService, [mockToken.address, ETHER_NATIVE_TOKEN.address]);
  });

  it('token details', async () => {
    await tokensDetailsStore.fetchTokensDetails();
    const {address, name, symbol} = tokensDetailsStore.tokensDetails[0];

    expect(address).to.eq(mockToken.address);
    expect(name).to.eq('MockToken');
    expect(symbol).to.eq('Mock');
  });

  it('ether details', async () => {
    await tokensDetailsStore.fetchTokensDetails();
    const {address, name, symbol} = tokensDetailsStore.tokensDetails[1];

    expect(address).to.eq(ETHER_NATIVE_TOKEN.address);
    expect(name).to.eq(ETHER_NATIVE_TOKEN.name);
    expect(symbol).to.eq(ETHER_NATIVE_TOKEN.symbol);
  });

  it('symbol -> address', async () => {
    await tokensDetailsStore.fetchTokensDetails();
    const {symbol} = tokensDetailsStore.tokensDetails[0];

    expect(tokensDetailsStore.getTokenAddress(symbol)).to.eq(mockToken.address);
  });

  it('symbol -> undefined', async () => {
    await tokensDetailsStore.fetchTokensDetails();

    expect(tokensDetailsStore.getTokenAddress('FAKE')).to.eq(undefined);
  });

  it('address -> token', async () => {
    await tokensDetailsStore.fetchTokensDetails();
    const expectedToken = tokensDetailsStore.tokensDetails[0];
    expect(tokensDetailsStore.getTokenByAddress(expectedToken.address)).to.deep.eq(expectedToken);
  });

  it('address -> error', async () => {
    await tokensDetailsStore.fetchTokensDetails();

    expect(() => tokensDetailsStore.getTokenByAddress('FAKE')).to.throw('Token not found (address = FAKE)');
  });
});
