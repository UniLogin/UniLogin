import {expect} from 'chai';
import TokenService from '../src/services/TokenService';
import {MockToken} from 'universal-login-commons/test';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {Contract} from 'ethers';

describe('TokenService', () => {
  let mockToken: Contract;
  let tokenService: TokenService;
  let symbol: string;
  let name: string;

  before(async () => {
    const provider = createMockProvider();
    const [wallet] = await getWallets(provider);
    mockToken = await deployContract(wallet, MockToken, []);
    tokenService = new TokenService([mockToken.address], provider);
    symbol = await mockToken.symbol();
    name = await mockToken.name();
    await tokenService.start();
  });

  it('Should fill up token details', async () => {
    expect(tokenService.tokensDetails[0].name).to.eq(name);
    expect(tokenService.tokensDetails[0].symbol).to.eq(symbol);
    expect(tokenService.tokensDetails[0].address).to.eq(mockToken.address);
  });

  it('Returns token address', async () => {
    expect(tokenService.getTokenAddress(symbol)).to.eq(mockToken.address);
  });
});
