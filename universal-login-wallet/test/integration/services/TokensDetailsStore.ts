import {expect} from 'chai';
import {Contract} from 'ethers';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN, TokenDetailsService} from '@universal-login/commons';
import {MockToken} from '@universal-login/commons/testutils';
import TokensDetailsStore from '../../../src/integration/ethereum/TokensDetailsStore';

describe('INT: TokensDetailsStore', () => {
  let mockToken: Contract;
  let tokensDetailsStore: TokensDetailsStore;
  let tokenDetailsService: TokenDetailsService;

  before(async () => {
    const provider = createMockProvider();
    const [wallet] = await getWallets(provider);
    mockToken = await deployContract(wallet, MockToken, []);
    tokenDetailsService = new TokenDetailsService(provider);
    tokensDetailsStore = new TokensDetailsStore(tokenDetailsService, [mockToken.address, ETHER_NATIVE_TOKEN.address]);
  });

  it('token details', async () => {
    await tokensDetailsStore.aggregateTokensDetails();
    const {address, name, symbol} = tokensDetailsStore.tokensDetails[0];

    expect(address).to.equal(mockToken.address);
    expect(name).to.equal('MockToken');
    expect(symbol).to.equal('Mock');
  });

  it('ether details', async () => {
    await tokensDetailsStore.aggregateTokensDetails();
    const {address, name, symbol} = tokensDetailsStore.tokensDetails[1];

    expect(address).to.equal(ETHER_NATIVE_TOKEN.address);
    expect(name).to.equal(ETHER_NATIVE_TOKEN.name);
    expect(symbol).to.equal(ETHER_NATIVE_TOKEN.symbol);
  });

  it('symbol -> address', async () => {
    await tokensDetailsStore.aggregateTokensDetails();
    const {symbol} = tokensDetailsStore.tokensDetails[0];

    expect(tokensDetailsStore.getTokenAddress(symbol)).to.equal(mockToken.address);
  });

  it('symbol -> undefined', async () => {
    await tokensDetailsStore.aggregateTokensDetails();

    expect(tokensDetailsStore.getTokenAddress('FAKE')).to.equal(undefined);
  });
});
