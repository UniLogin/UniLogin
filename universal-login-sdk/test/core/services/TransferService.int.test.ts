import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Contract, providers, Wallet} from 'ethers';
import {createFixtureLoader, solidity, MockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, TokenDetailsService, TEST_GAS_PRICE} from '@unilogin/commons';
import {deployMockToken} from '@unilogin/commons/testutils';
import UniLoginSdk from '../../../src/api/sdk';
import {WalletService} from '../../../src/core/services/WalletService';
import {TransferService} from '../../../src/core/services/TransferService';
import {TokensDetailsStore} from '../../../src/core/services/TokensDetailsStore';
import {createAndSetWallet, createdDeployedWallet} from '../../helpers/createDeployedWallet';
import {setupSdk} from '../../helpers/setupSdk';

chai.use(solidity);
chai.use(chaiAsPromised);

const gasParameters = {
  gasPrice: utils.bigNumberify(TEST_GAS_PRICE),
  gasToken: ETHER_NATIVE_TOKEN.address,
};

describe('INT: TransferService', () => {
  let transferService: TransferService;
  let provider: providers.Provider;
  let relayer: any;
  let sdk: UniLoginSdk;
  let mockTokenContract: Contract;
  let tokenDetailsService: TokenDetailsService;
  let tokenService: TokensDetailsStore;
  let wallet: Wallet;
  let balance: string;

  before(async () => {
    const mockProvider = new MockProvider();
    [wallet] = mockProvider.getWallets();
    ({sdk, relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(mockProvider)(deployMockToken));
    const walletService = new WalletService(sdk);
    const {contractAddress} = await createAndSetWallet('name.mylogin.eth', walletService, wallet, sdk);
    await mockTokenContract.transfer(contractAddress, utils.parseEther('2.0'));
    tokenDetailsService = new TokenDetailsService(provider);
    tokenService = new TokensDetailsStore(tokenDetailsService, [mockTokenContract.address]);
    await tokenService.fetchTokensDetails();
    (sdk as any).tokensDetailsStore = tokenService;
    transferService = new TransferService(walletService.getDeployedWallet());
    balance = '5';
  });

  it('Should transfer tokens', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '1.0';
    const token = {address: mockTokenContract.address, decimals: 18};
    const {waitToBeSuccess} = await transferService.transfer({to, amount, token, gasParameters});
    await waitToBeSuccess();
    expect(await mockTokenContract.balanceOf(to)).to.deep.eq(utils.parseEther(amount));
  });

  it('Should transfer ether', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to, amount, token: {address: ETHER_NATIVE_TOKEN.address, decimals: ETHER_NATIVE_TOKEN.decimals}, gasParameters});
    await waitToBeSuccess();
    expect(await provider.getBalance(to)).to.eq(utils.parseEther(amount));
  });

  it('Should throw error if invalid address', async () => {
    const to = `${TEST_ACCOUNT_ADDRESS}3`;
    const amount = '0.5';
    await expect(transferService.transfer({to, amount, token: {address: ETHER_NATIVE_TOKEN.address, decimals: ETHER_NATIVE_TOKEN.decimals}, gasParameters})).to.be.rejectedWith(`${to} is not valid`);
  });

  it('transfer ether to ens name', async () => {
    const targetENSName = 'ether.mylogin.eth';
    const {contractAddress} = await createdDeployedWallet(targetENSName, sdk, wallet);
    const amount = '0.5';
    const initialTargetBalance = await provider.getBalance(contractAddress);
    const {waitToBeSuccess} = await transferService.transfer({to: targetENSName, token: {address: ETHER_NATIVE_TOKEN.address, decimals: ETHER_NATIVE_TOKEN.decimals}, gasParameters, amount});
    await waitToBeSuccess();
    expect(await provider.getBalance(contractAddress)).to.eq(initialTargetBalance.add(utils.parseEther(amount)));
  });

  it('transfer token to ens name', async () => {
    const targetENSName = 'token.mylogin.eth';
    const {contractAddress} = await createdDeployedWallet(targetENSName, sdk, wallet);
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to: targetENSName, token: {address: mockTokenContract.address, decimals: ETHER_NATIVE_TOKEN.decimals}, gasParameters, amount});
    await waitToBeSuccess();
    expect(await mockTokenContract.balanceOf(contractAddress)).to.eq(utils.parseEther(amount));
  });

  it('throw error if there is no such ens name', async () => {
    const targetENSName = 'not-existing.mylogin.eth';
    const amount = '0.5';
    await expect(transferService.transfer({
      to: targetENSName,
      token: {
        address: mockTokenContract.address,
        decimals: 18,
      },
      gasParameters,
      amount,
    })).to.be.rejectedWith(`${targetENSName} is not valid`);
  });

  it('return an error if invalid amount', async () => {
    const targetENSName = 'ether-test.mylogin.eth';
    await createdDeployedWallet(targetENSName, sdk, wallet);
    const amount = '7';
    expect(await transferService.validateInputs({
      to: targetENSName,
      token: {
        address: mockTokenContract.address,
        decimals: 18,
      },
      gasParameters,
      amount,
    }, balance))
      .to.deep.eq({amount: ['Insufficient funds. Sending 7.0 eth, got only 5.0 eth'], to: []});
  });

  it('return an error if invalid address', async () => {
    const invalidAddress = '0x123';
    const amount = '0.5';
    expect(await transferService.validateInputs({
      to: invalidAddress,
      token: {
        address: mockTokenContract.address,
        decimals: 18,
      },
      gasParameters,
      amount,
    }, balance))
      .to.deep.eq({to: [`${invalidAddress} is not a valid address`], amount: []});
  });

  it('return an error if invalid ENS name', async () => {
    const invalidENSName = 'test';
    const amount = '0.5';
    expect(await transferService.validateInputs({
      to: invalidENSName,
      token: {
        address: mockTokenContract.address,
        decimals: 18,
      },
      gasParameters,
      amount,
    }, balance))
      .to.deep.eq({to: [`${invalidENSName} is not a valid address or ENS name`], amount: []});
  });

  it('return an error if not-existing ENS name', async () => {
    const invalidENSName = 'not-existing.mylogin.eth';
    const amount = '0.5';
    expect(await transferService.validateInputs({
      to: invalidENSName,
      token: {
        address: mockTokenContract.address,
        decimals: 18,
      },
      gasParameters,
      amount,
    }, balance))
      .to.deep.eq({to: [`Can't resolve ENS address: ${invalidENSName}`], amount: []});
  });

  it('get Ethereum max amount', async () => {
    const {address} = Wallet.createRandom();
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to: address, amount, token: {address: ETHER_NATIVE_TOKEN.address, decimals: ETHER_NATIVE_TOKEN.decimals}, gasParameters});
    await waitToBeSuccess();
    const balance = await provider.getBalance(address);
    expect(transferService.getMaxAmount(gasParameters, utils.formatEther(balance))).to.eq('0.496');
  });

  it('get 0 if Ethereum max amount is below 0', async () => {
    const {address} = Wallet.createRandom();
    const balance = await provider.getBalance(address);
    expect(transferService.getMaxAmount(gasParameters, utils.formatEther(balance))).to.eq('0.0');
  });

  after(async () => {
    await relayer.stop();
  });
});
