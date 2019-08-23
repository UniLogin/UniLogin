import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, deployContract} from 'ethereum-waffle';
import {expect} from 'chai';
import {TokenDetailsService} from '../../../lib/integration/ethereum/TokenDetailsService';
import {ETHER_NATIVE_TOKEN} from '../../../lib/core/constants/constants';
import MockToken from '../../fixtures/MockToken.json';

describe('INT: TokenDetailsService', () => {
  let provider: providers.Provider;
  let tokenDetailsService: TokenDetailsService;
  let wallet: Wallet;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    tokenDetailsService = new TokenDetailsService(provider);
  });

  it('ether', async () => {
    const details = await tokenDetailsService.getTokenDetails(ETHER_NATIVE_TOKEN.address);

    expect(details.symbol).to.eq(ETHER_NATIVE_TOKEN.symbol);
    expect(details.name).to.eq(ETHER_NATIVE_TOKEN.name);
    expect(details.address).to.eq(ETHER_NATIVE_TOKEN.address);
  });

  it('token', async () => {
    const mockToken = await deployContract(wallet, MockToken, []);
    const details = await tokenDetailsService.getTokenDetails(mockToken.address);

    expect(details.symbol).to.eq('Mock');
    expect(details.name).to.eq('MockToken');
    expect(details.address).to.eq(mockToken.address);
  });

  it('token not deployed', async () => {
    const notDeployedtokenAddress = '0x000000000000000000000000000000000000DEAD';
    expect(tokenDetailsService.getSymbol(notDeployedtokenAddress)).to.be.eventually.rejectedWith('contract not deployed');
  });

  it('[token, ether]', async () => {
    const mockToken = await deployContract(wallet, MockToken, []);
    const tokensDetails = await tokenDetailsService.getTokensDetails([mockToken.address, ETHER_NATIVE_TOKEN.address]);

    expect(tokensDetails).to.be.lengthOf(2);

    const [tokenDetails, etherDetails] = tokensDetails;

    expect(tokenDetails.symbol).to.eq('Mock');
    expect(tokenDetails.name).to.eq('MockToken');
    expect(tokenDetails.address).to.eq(mockToken.address);

    expect(etherDetails.symbol).to.eq(ETHER_NATIVE_TOKEN.symbol);
    expect(etherDetails.name).to.eq(ETHER_NATIVE_TOKEN.name);
    expect(etherDetails.address).to.eq(ETHER_NATIVE_TOKEN.address);
  });
});
