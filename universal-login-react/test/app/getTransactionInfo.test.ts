import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {utils, Contract, Wallet} from 'ethers';
import {solidity, MockProvider} from 'ethereum-waffle';
import {ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import UniLoginSdk, {WalletService} from '@unilogin/sdk';
import {createAndSetWallet, setupSdk} from '@unilogin/sdk/testutils';
import {IERC20Interface} from '@unilogin/contracts';
import {getTransactionInfo} from '../../src/app/getTransactionInfo';

chai.use(solidity);
chai.use(chaiAsPromised);

describe('INT: getTransactionInfo', () => {
  let relayer: any;
  let sdk: UniLoginSdk;
  let mockToken: Contract;
  let wallet: Wallet;
  let walletService: WalletService;

  before(async () => {
    [wallet] = new MockProvider().getWallets();
    ({sdk, relayer, mockToken} = await setupSdk(wallet, '33113'));
    walletService = new WalletService(sdk);
    await createAndSetWallet('name.mylogin.eth', walletService, wallet, sdk);
  });

  it('getTransactionInfo returns ETH', async () => {
    const {address} = Wallet.createRandom();
    const value = utils.parseEther('5').toString();
    expect(await getTransactionInfo(walletService.getDeployedWallet(), {to: address, value, data: '0x0'})).to.deep.eq({tokenDetails: ETHER_NATIVE_TOKEN, value, targetAddress: address});
  });

  it('getTransactionInfo returns token symbol', async () => {
    const {address} = Wallet.createRandom();
    const value = utils.parseEther('0.01').toString();
    const data = IERC20Interface.functions.transfer.encode([address, value]);
    expect(await getTransactionInfo(walletService.getDeployedWallet(), {to: mockToken.address, value: '0', data})).to.deep.eq({tokenDetails: {symbol: 'DAI', name: 'Dai Stablecoin', address: mockToken.address, decimals: 18}, value, targetAddress: address});
  });

  after(async () => {
    await relayer.stop();
  });
});
