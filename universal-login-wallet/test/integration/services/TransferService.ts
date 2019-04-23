import TransferService from '../../../src/services/TransferService';
import chai, {expect} from 'chai';
import UniversalLoginSDK from '@universal-login/sdk';
import createWallet from '../../../src/services/Creation';
import {deployMockToken} from '@universal-login/commons/test';
import {createFixtureLoader, getWallets, solidity} from 'ethereum-waffle';
import WalletService from '../../../src/services/WalletService';
import {utils, providers, Contract} from 'ethers';
import {setupSdk} from '@universal-login/sdk/test';
import TokenService from '../../../src/services/TokenService';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

chai.use(solidity);

describe('TransferService', () => {
  let transferService: TransferService;
  let provider: providers.Provider;
  let relayer: any;
  let sdk: UniversalLoginSDK;
  let mockTokenContract: Contract;
  let contractAddress: string;
  let tokenService: TokenService;

  before(async () => {
    ({sdk, relayer, provider} = await setupSdk({overridePort: '33113'}));
    const [randomWallet] = await getWallets(provider);
    ({mockTokenContract} = await createFixtureLoader(provider as providers.Web3Provider)(deployMockToken));
    const walletService = new WalletService();
    [, contractAddress] = await createWallet(sdk, walletService)('name.mylogin.eth');
    await randomWallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    await mockTokenContract.transfer(contractAddress, utils.parseEther('2.0'));
    tokenService = new TokenService([mockTokenContract.address], provider);
    await tokenService.start();
    transferService = new TransferService(sdk, walletService, tokenService);
  });

  it('Should transfer tokens', async () => {
    const to = '0x0000000000000000000000000000000000000001';
    const amount = '1.0';
    const currency = 'Mock';
    await transferService.transfer({to, amount, currency});
    expect(await mockTokenContract.balanceOf(to)).to.deep.eq(utils.parseEther(amount));
  });

  it('Should transfer ether', async () => {
    const to = '0x0000000000000000000000000000000000000001';
    const amount = '0.5';
    const currency = ETHER_NATIVE_TOKEN.symbol;
    await transferService.transfer({to, amount, currency});
    expect(await provider.getBalance(to)).to.eq(utils.parseEther(amount));
  });

  after(async () => {
    await relayer.stop();
  });
});
