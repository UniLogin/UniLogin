import {expect} from 'chai';
import TokenService from '../../../src/integration/ethereum/TokenService';
import {MockToken} from '@universal-login/commons/testutils';
import {deployContract, getWallets, createMockProvider} from 'ethereum-waffle';
import {Contract} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

describe('TokenService', () => {
  let mockToken: Contract;
  let tokenService: TokenService;
  let symbol: string;
  let name: string;

  before(async () => {
    const provider = createMockProvider();
    const [wallet] = await getWallets(provider);
    mockToken = await deployContract(wallet, MockToken, []);
    tokenService = new TokenService([mockToken.address, ETHER_NATIVE_TOKEN.address], provider);
    symbol = await mockToken.symbol();
    name = await mockToken.name();
    await tokenService.start();
  });

  it('Should fill up token details', async () => {
    expect(tokenService.tokensDetails[0].name).to.eq(name);
    expect(tokenService.tokensDetails[0].symbol).to.eq(symbol);
    expect(tokenService.tokensDetails[0].address).to.eq(mockToken.address);
  });

  it('Should fill up ether details', async () => {
    expect(tokenService.tokensDetails[1]).to.deep.eq(ETHER_NATIVE_TOKEN);
  });

  it('Returns token address', async () => {
    expect(tokenService.getTokenAddress(symbol)).to.eq(mockToken.address);
  });
});
