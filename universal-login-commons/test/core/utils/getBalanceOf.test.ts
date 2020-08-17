import {expect} from 'chai';
import {getBalanceOf} from '../../../src/core/utils/getBalanceOf';
import {ETHER_NATIVE_TOKEN, TokenDetailsWithBalance, TEST_TOKEN_ADDRESS} from '../../../src';
import {utils} from 'ethers';

describe('UNIT: getBalanceOf', () => {
  const tokensDetailsWithBalance: TokenDetailsWithBalance[] = [
    {symbol: 'ETH', name: 'ether', address: ETHER_NATIVE_TOKEN.address, balance: utils.parseEther('1.2'), decimals: 18},
    {symbol: 'USDC', name: 'USD//C', address: TEST_TOKEN_ADDRESS, balance: utils.parseUnits('2.3', 6), decimals: 6},
  ];

  it('null', () => {
    expect(getBalanceOf('BTC', tokensDetailsWithBalance)).to.deep.eq(null);
  });

  it('ETH', () => {
    expect(getBalanceOf('ETH', tokensDetailsWithBalance)).to.deep.eq('1.2');
  });

  it('USDC', () => {
    expect(getBalanceOf('USDC', tokensDetailsWithBalance)).to.deep.eq('2.3');
  });
});
