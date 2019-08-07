import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {expect} from 'chai';
import {TokenDetailsService} from '../../../lib/integration/ethereum/TokenDetailsService';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import MockToken from '../../fixtures/MockToken.json';

describe('INT: TokenDetailsService', () => {
  let provider: providers.Provider;
  let tokenService: TokenDetailsService;
  let wallet: Wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    tokenService = new TokenDetailsService(provider);
  });

  it('ether', async () => {
    const symbol = await tokenService.getSymbol(ETHER_NATIVE_TOKEN.address);
    const name = await tokenService.getName(ETHER_NATIVE_TOKEN.address);

    expect(symbol).to.eq(ETHER_NATIVE_TOKEN.symbol);
    expect(name).to.eq(ETHER_NATIVE_TOKEN.name);
  });

  it('token', async () => {
    const mockToken = await deployContract(wallet, MockToken, []);
    const symbol = await tokenService.getSymbol(mockToken.address);
    const name = await tokenService.getName(mockToken.address);

    expect(symbol).to.eq('Mock');
    expect(name).to.eq('MockToken');
  });

  it('token not deployed', async () => {
    const notDeployedtokenAddress = '0x000000000000000000000000000000000000DEAD';
    expect(tokenService.getSymbol(notDeployedtokenAddress)).to.be.eventually.rejectedWith('contract not deployed');
  });
});
