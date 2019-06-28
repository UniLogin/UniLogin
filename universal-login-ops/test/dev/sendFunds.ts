import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {sendFunds, SendFundsParameters} from '../../src/ops/sendFunds';
import {providers, Wallet, utils} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN} from '@universal-login/commons';

chai.use(solidity);
chai.use(chaiAsPromised);

describe('SendFunds', () => {
  let provider : providers.Provider;
  let wallet : Wallet;
  let args : SendFundsParameters;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    args = {
      nodeUrl: '',
      privateKey: wallet.privateKey,
      to: TEST_ACCOUNT_ADDRESS,
      amount: '1',
      currency: ETHER_NATIVE_TOKEN.symbol,
      provider
    };
  });

  it('should send funds', async () => {
    await sendFunds(args);
    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1.0'));
  });

  it('should send decimal funds', async () => {
    const decimalAmount = '0.000000001234';
    await sendFunds({...args, amount: decimalAmount});
    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther(decimalAmount));
  });

  it('should send critical decimal funds correctly', async () => {
    const decimalAmount = '0.0000000000000000009';
    await expect(sendFunds({...args, amount: decimalAmount})).to.be.eventually.rejected;
  });
});

