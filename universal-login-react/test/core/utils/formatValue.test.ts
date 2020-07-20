import {expect} from 'chai';
import {formatValue} from '../../../src/core/utils/formatValue';

describe('UNIT: formatValue', () => {
  it('token with decimals eq 18', () => {
    const sdk = {tokensDetailsStore: {getTokenBy: () => ({decimals: 18})}} as any;
    expect(formatValue(sdk, '1.8', 'eth')).eq('1800000000000000000');
    expect(formatValue(sdk, '1.54', 'eth')).eq('1540000000000000000');
    expect(formatValue(sdk, '1.23456789', 'eth')).eq('1234567890000000000');
  });

  it('token with decimals eq 6', () => {
    const sdk = {tokensDetailsStore: {getTokenBy: () => ({decimals: 6})}} as any;
    expect(formatValue(sdk, '1.8', 'eth')).eq('1800000');
    expect(formatValue(sdk, '1.123456', 'eth')).eq('1123456');
    expect(() => formatValue(sdk, '1.123456', 'eth')).throws;
  });
});
