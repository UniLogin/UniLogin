import TransferService from '../src/services/TransferService';
import {expect} from 'chai';
import setupSdk from './SetupSdk';
import UniversalLoginSDK from 'universal-login-sdk';
import createWallet from '../src/services/Creation';
import {deployMockToken} from 'universal-login-commons/test';
import {createFixtureLoader} from 'ethereum-waffle';
import WalletService from '../src/services/WalletService';
import {utils, providers} from 'ethers';



describe('TransferService', () => {
  let transferService: TransferService;
  let provider: providers.Web3Provider;
  let relayer: any;
  let sdk: UniversalLoginSDK;
  let mockTokenContract: any;
  let privateKey;
  let contractAddress: string;

  before(async () => {
    ({sdk, relayer, provider} = await setupSdk());
    ({mockTokenContract} = await createFixtureLoader(provider)(deployMockToken));
    const walletService = new WalletService();
    [privateKey, contractAddress] = await createWallet(sdk, walletService)('name.mylogin.eth');
    await mockTokenContract.transfer(contractAddress, utils.parseEther('2.0'))
    transferService = new TransferService(sdk, walletService);
  });

  it('Should transfer tokens', async () => {
    const to = '0x0000000000000000000000000000000000000001';
    const amount = '1.0';
    const currency = mockTokenContract.address;
    await transferService.transferTokens(to, amount, currency);
    expect(await mockTokenContract.balanceOf(to)).to.deep.eq(utils.parseEther(amount));
  });

  after(async () => {
    await relayer.stop();
  })
});
