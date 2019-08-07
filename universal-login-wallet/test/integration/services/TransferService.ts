import chai, {expect} from 'chai';
import {utils, providers, Contract} from 'ethers';
import {createFixtureLoader, getWallets, solidity, createMockProvider} from 'ethereum-waffle';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, TokenDetailsService} from '@universal-login/commons';
import {deployMockToken} from '@universal-login/commons/testutils';
import TransferService from '../../../src/integration/ethereum/TransferService';
import TokenService from '../../../src/integration/ethereum/TokensDetailsStore';
import {createWallet} from '../helpers/createWallet';
import {setupSdk} from '../helpers/setupSdk';

chai.use(solidity);

describe('INT: TransferService', () => {
  let transferService: TransferService;
  let provider: providers.Provider;
  let relayer: any;
  let sdk: UniversalLoginSDK;
  let mockTokenContract: Contract;
  let tokenDetailsService: TokenDetailsService;
  let tokenService: TokenService;

  before(async () => {
    const [wallet] = await getWallets(createMockProvider());
    ({sdk, relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    const walletService = new WalletService(sdk);
    const {contractAddress} = await createWallet('name.mylogin.eth', walletService, wallet);
    await mockTokenContract.transfer(contractAddress, utils.parseEther('2.0'));
    tokenDetailsService = new TokenDetailsService(provider);
    tokenService = new TokenService(tokenDetailsService, [mockTokenContract.address]);
    await tokenService.aggregateTokensDetails();
    transferService = new TransferService(sdk, walletService, tokenService);
  });

  it('Should transfer tokens', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '1.0';
    const currency = 'Mock';
    await transferService.transfer({to, amount, currency});
    expect(await mockTokenContract.balanceOf(to)).to.deep.eq(utils.parseEther(amount));
  });

  it('Should transfer ether', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '0.5';
    const currency = ETHER_NATIVE_TOKEN.symbol;
    await transferService.transfer({to, amount, currency});
    expect(await provider.getBalance(to)).to.eq(utils.parseEther(amount));
  });

  after(async () => {
    await relayer.stop();
  });
});
