import chai, {expect} from 'chai';
import {sendFunds, sendFundsParameters} from '../../src/dev/sendFunds';
import {providers, Wallet} from 'ethers';
import {createMockProvider, getWallets, solidity} from 'ethereum-waffle';
import {NULL_PUBLIC_KEY, ETHER_NATIVE_TOKEN, etherFormatOf} from 'universal-login-commons';

chai.use(solidity);

describe('SendFunds', () => {
  let provider : providers.Provider;
  let wallet : Wallet;
  let args : sendFundsParameters;

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    args = {
      nodeUrl: '',
      privateKey: wallet.privateKey,
      to: NULL_PUBLIC_KEY,
      amount: 1,
      currency: ETHER_NATIVE_TOKEN.symbol,
      provider
    };
  });

  it('should send funds', async () => {
    await sendFunds(args);
    expect(await provider.getBalance(NULL_PUBLIC_KEY)).to.eq(etherFormatOf(1));
  });

  it('should send decimal funds', async () => {
    const decimalAmount = 0.000000001234;
    await sendFunds({...args, amount: decimalAmount});
    expect(await provider.getBalance(NULL_PUBLIC_KEY)).to.eq(etherFormatOf(decimalAmount));
  });

  it('should send critical decimal funds correctly', async () => {
    const decimalAmount = 0.0000000000000000009;
    const roundOffAmount = 0.000000000000000001;
    await sendFunds({...args, amount: decimalAmount});
    expect(await provider.getBalance(NULL_PUBLIC_KEY)).to.eq(etherFormatOf(roundOffAmount));
  });
});

