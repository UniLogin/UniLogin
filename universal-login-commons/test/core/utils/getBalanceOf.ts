import {expect} from 'chai';
import {getBalanceOf} from '../../../lib/core/utils/getBalanceOf';
import {ETHER_NATIVE_TOKEN, TokenDetailsWithBalance} from '../../../lib';
import {utils} from 'ethers';

describe('UNIT: getBalanceOf', () => {
  const tokensDetailsWithBalance: TokenDetailsWithBalance[] = [
    {symbol: 'ETH', name: 'ether', address: ETHER_NATIVE_TOKEN.address, balance: utils.parseEther('1.2')}
  ];

  it('null', () => {
    expect(getBalanceOf('BTC', tokensDetailsWithBalance)).to.deep.eq(null);
  });

  it('ETH', () => {
    expect(getBalanceOf('ETH', tokensDetailsWithBalance)).to.deep.eq('1.2');
  });
});
