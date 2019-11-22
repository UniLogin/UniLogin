import {expect} from 'chai';
import {utils} from 'ethers';
import {ETHER_NATIVE_TOKEN} from '../../../lib';
import {isValidAmount, isAmountInConstraints} from '../../../lib/core/utils/isValidAmount';
import {Nullable} from '../../../lib/core/types/common';

describe('isAmountInConstraints', () => {
  const itValidatesAmount = (amount: string | undefined, balance: string, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance}`, () => {
      const balanceInWei = utils.parseEther(balance);
      expect(isAmountInConstraints(balanceInWei, amount)).to.eq(result);
    });
  };

  itValidatesAmount('1.0', '2', true);
  itValidatesAmount('10', '20', true);
  itValidatesAmount('2', '2.01', true);
  itValidatesAmount('ABC', '1', false);
  itValidatesAmount('0', '1', false);
  itValidatesAmount('1a00.1', '1', false);
  itValidatesAmount('14$.9', '1', false);
  itValidatesAmount('100.', '1', false);
  itValidatesAmount('100', '1', false);
  itValidatesAmount('100', '99', false);
  itValidatesAmount(undefined, '1.0', false);
});

describe('isValidAmount', () => {
  const itValidatesAmountForEther = (amount: string | undefined, balance: Nullable<string>, gasCostInWei: utils.BigNumber, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance} for ether`, () => {
      expect(isValidAmount(ETHER_NATIVE_TOKEN.address, balance, gasCostInWei, amount)).to.eq(result);
    });
  };

  const itValidatesAmountForToken = (amount: string | undefined, balance: Nullable<string>, gasCostInWei: utils.BigNumber, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance} for token`, () => {
      expect(isValidAmount('0x0005abcbb9533cf6f9370505ffef25393e0d2852', balance, gasCostInWei, amount)).to.eq(result);
    });
  };

  const gasCostInWei = utils.parseEther('2');

  itValidatesAmountForEther('1', '5', gasCostInWei, true);
  itValidatesAmountForToken('1', '5', gasCostInWei, true);
  itValidatesAmountForEther('1', '2', gasCostInWei, false);
  itValidatesAmountForToken('1', '2', gasCostInWei, true);
  itValidatesAmountForEther('2', '1', gasCostInWei, false);
  itValidatesAmountForToken('2', '1', gasCostInWei, false);
  itValidatesAmountForEther('1', null, gasCostInWei, false);
  itValidatesAmountForToken('1', null, gasCostInWei, false);
  itValidatesAmountForEther(undefined, '2', gasCostInWei, false);
  itValidatesAmountForToken(undefined, '2', gasCostInWei, false);
  itValidatesAmountForEther(undefined, null, gasCostInWei, false);
  itValidatesAmountForToken(undefined, null, gasCostInWei, false);
});
