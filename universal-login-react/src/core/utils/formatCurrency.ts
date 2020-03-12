import {ValueRounder, ValuePresenter} from '@unilogin/commons';

export const formatCurrency = (value: string, currency = 'USD'): string => {
  const maximumFractionDigits = 2;
  const style = currency ? 'currency' : 'decimal';
  const formatter = new Intl.NumberFormat('en-US', {currency: 'USD', style});
  return formatter.format(Number.parseFloat(ValuePresenter.presentRoundedValue(value || '0', ValueRounder.floor, maximumFractionDigits)));
};

export const getTildeGivenAmount = (amount: string) => {
  return amount && amount !== '0' ? '~' : '';
};
