import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, providers, Contract, Wallet} from 'ethers';
import {createFixtureLoader, getWallets, solidity, createMockProvider} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, TEST_TOKEN_DETAILS, ETHER_NATIVE_TOKEN, TokenDetailsService} from '@universal-login/commons';
import {deployMockToken} from '@universal-login/commons/testutils';
import UniversalLoginSDK from '../../../lib/api/sdk';
import {WalletService} from '../../../lib/core/services/WalletService';
import {TransferService} from '../../../lib/core/services/TransferService';
import {TokensDetailsStore} from '../../../lib/core/services/TokensDetailsStore';
import {createAndSetWallet, createWallet} from '../../helpers/createWallet';
import {setupSdk} from '../../helpers/setupSdk';

chai.use(solidity);
chai.use(chaiAsPromised);

const gasParameters = {
  gasPrice: utils.bigNumberify('1'),
  gasToken: ETHER_NATIVE_TOKEN.address,
};

describe('INT: TransferService', () => {
  let transferService: TransferService;
  let provider: providers.Provider;
  let relayer: any;
  let sdk: UniversalLoginSDK;
  let mockTokenContract: Contract;
  let tokenDetailsService: TokenDetailsService;
  let tokenService: TokensDetailsStore;
  let wallet: Wallet;
  let balance: string;

  before(async () => {
    [wallet] = await getWallets(createMockProvider());
    ({sdk, relayer, provider} = await setupSdk(wallet, '33113'));
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    const walletService = new WalletService(sdk);
    const {contractAddress} = await createAndSetWallet('name.mylogin.eth', walletService, wallet, sdk);
    await mockTokenContract.transfer(contractAddress, utils.parseEther('2.0'));
    tokenDetailsService = new TokenDetailsService(provider);
    tokenService = new TokensDetailsStore(tokenDetailsService, [mockTokenContract.address]);
    await tokenService.fetchTokensDetails();
    sdk.tokensDetailsStore = tokenService;
    transferService = new TransferService(walletService.getDeployedWallet());
    balance = '5';
  });

  it('Should transfer tokens', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '1.0';
    const transferToken = TEST_TOKEN_DETAILS[0].address;
    const {waitToBeSuccess} = await transferService.transfer({to, amount, transferToken, gasParameters});
    await waitToBeSuccess();
    expect(await mockTokenContract.balanceOf(to)).to.deep.eq(utils.parseEther(amount));
  });

  it('Should transfer ether', async () => {
    const to = TEST_ACCOUNT_ADDRESS;
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to, amount, transferToken: ETHER_NATIVE_TOKEN.address, gasParameters});
    await waitToBeSuccess();
    expect(await provider.getBalance(to)).to.eq(utils.parseEther(amount));
  });

  it('Should throw error if invalid address', async () => {
    const to = `${TEST_ACCOUNT_ADDRESS}3`;
    const amount = '0.5';
    await expect(transferService.transfer({to, amount, transferToken: ETHER_NATIVE_TOKEN.address, gasParameters})).to.be.rejectedWith(`${to} is not valid`);
  });

  it('transfer ether to ens name', async () => {
    const targetENSName = 'ether.mylogin.eth';
    const {contractAddress} = await createWallet(targetENSName, sdk, wallet);
    const amount = '0.5';
    const initialTargetBalance = await provider.getBalance(contractAddress);
    const {waitToBeSuccess} = await transferService.transfer({to: targetENSName, transferToken: ETHER_NATIVE_TOKEN.address, gasParameters, amount});
    await waitToBeSuccess();
    expect(await provider.getBalance(contractAddress)).to.eq(initialTargetBalance.add(utils.parseEther(amount)));
  });

  it('transfer token to ens name', async () => {
    const targetENSName = 'token.mylogin.eth';
    const {contractAddress} = await createWallet(targetENSName, sdk, wallet);
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to: targetENSName, transferToken: mockTokenContract.address, gasParameters, amount});
    await waitToBeSuccess();
    expect(await mockTokenContract.balanceOf(contractAddress)).to.eq(utils.parseEther(amount));
  });

  it('throw error if there is no such ens name', async () => {
    const targetENSName = 'not-existing.mylogin.eth';
    const amount = '0.5';
    await expect(transferService.transfer({
      to: targetENSName,
      transferToken: mockTokenContract.address,
      gasParameters,
      amount,
    })).to.be.rejectedWith(`${targetENSName} is not valid`);
  });

  it('return an error if invalid amount', async () => {
    const targetENSName = 'ether-test.mylogin.eth';
    await createWallet(targetENSName, sdk, wallet);
    const amount = '7';
    expect(transferService.validateInputs({
      to: targetENSName,
      transferToken: mockTokenContract.address,
      gasParameters,
      amount,
    }, balance).amount[0]).to.eq(`Amount ${amount} is not valid`);
  });

  it('return an error if invalid address', async () => {
    const invalidAddress = '0x123';
    const amount = '0.5';
    expect(transferService.validateInputs({
      to: invalidAddress,
      transferToken: mockTokenContract.address,
      gasParameters,
      amount,
    }, balance).to[0]).to.eq(`Recipient ${invalidAddress} is not valid`);
  });

  it('return an error if invalid ENS name', async () => {
    const invalidENSName = 'test';
    const amount = '0.5';
    expect(transferService.validateInputs({
      to: invalidENSName,
      transferToken: mockTokenContract.address,
      gasParameters,
      amount,
    }, balance).to[0]).to.eq(`Recipient ${invalidENSName} is not valid`);
  });

  it('get Ethereum max amount', async () => {
    const {address} = Wallet.createRandom();
    const amount = '0.5';
    const {waitToBeSuccess} = await transferService.transfer({to: address, amount, transferToken: ETHER_NATIVE_TOKEN.address, gasParameters});
    await waitToBeSuccess();
    const balance = await provider.getBalance(address);
    expect(transferService.getEtherMaxAmount(gasParameters, utils.formatEther(balance))).to.eq('0.4999999999998');
  });

  it('get 0 if Ethereum max amount is below 0', async () => {
    const {address} = Wallet.createRandom();
    const balance = await provider.getBalance(address);
    expect(transferService.getEtherMaxAmount(gasParameters, utils.formatEther(balance))).to.eq('0.0');
  });

  after(async () => {
    await relayer.stop();
  });
});
