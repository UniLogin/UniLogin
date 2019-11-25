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

  itValidatesAmount('2', '2', true);
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
  const itValidatesAmountForEther = (amount: string | undefined, balance: Nullable<string>, gasToken: string, gasCostInWei: utils.BigNumber, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance} for ether`, () => {
      expect(isValidAmount(ETHER_NATIVE_TOKEN.address, balance, gasToken, gasCostInWei, amount)).to.eq(result);
    });
  };

  const itValidatesAmountForToken = (amount: string | undefined, balance: Nullable<string>, gasToken: string, gasCostInWei: utils.BigNumber, result: boolean) => {
    it(`returns ${result} for amount: ${amount} and balance: ${balance} for token`, () => {
      expect(isValidAmount('0x0005abcbb9533cf6f9370505ffef25393e0d2852', balance, gasToken, gasCostInWei, amount)).to.eq(result);
    });
  };

  const gasCostInWei = utils.parseEther('2');
  const etherGasToken = ETHER_NATIVE_TOKEN.address;
  const daiGasToken = '0x0005abcbb9533cf6f9370505ffef25393e0d2852';

  itValidatesAmountForEther('3', '5', etherGasToken, gasCostInWei, true);
  itValidatesAmountForToken('3', '5', daiGasToken, gasCostInWei, true);
  itValidatesAmountForEther('1', '2', daiGasToken, gasCostInWei, true);
  itValidatesAmountForToken('1', '2', etherGasToken, gasCostInWei, true);
  itValidatesAmountForEther('1', '2', etherGasToken, gasCostInWei, false);
  itValidatesAmountForToken('1', '2', daiGasToken, gasCostInWei, false);
  itValidatesAmountForEther('2', '1', etherGasToken, gasCostInWei, false);
  itValidatesAmountForToken('2', '1', daiGasToken, gasCostInWei, false);
  itValidatesAmountForEther('1', null, etherGasToken, gasCostInWei, false);
  itValidatesAmountForToken('1', null, daiGasToken, gasCostInWei, false);
  itValidatesAmountForEther(undefined, '2', etherGasToken, gasCostInWei, false);
  itValidatesAmountForToken(undefined, '2', daiGasToken, gasCostInWei, false);
  itValidatesAmountForEther(undefined, null, etherGasToken, gasCostInWei, false);
  itValidatesAmountForToken(undefined, null, daiGasToken, gasCostInWei, false);
});
