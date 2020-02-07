import {expect} from 'chai';
import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {TEST_PRIVATE_KEY, ETHER_NATIVE_TOKEN, TEST_TOKEN_ADDRESS, TEST_ACCOUNT_ADDRESS} from '../../../src';
import {getTestSignedMessage} from '../../helpers/getTestMessage';
import {getTransferCurrencyValueFrom} from '../../../src/core/utils/getTransferCurrencyValueFrom';
import {CurrencyValue} from '../../../src/core/models/CurrencyValue';

describe('UNIT: getTransferCurrencyValueFrom', () => {
  it('value higher than 0', () => {
    const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {value: '100'});
    expect(getTransferCurrencyValueFrom(signedMessage)).to.deep.eq(CurrencyValue.fromWei(100, ETHER_NATIVE_TOKEN.address));
  });

  it('value is 0 and data is not transfer', () => {
    const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {value: '0'});
    expect(getTransferCurrencyValueFrom(signedMessage)).to.eq(null);
  });

  it('value is 0 and data is transfer', () => {
    const expectedValue = utils.parseEther('2');
    const transferData = new utils.Interface(IERC20.abi as any).functions.transfer.encode([TEST_ACCOUNT_ADDRESS, expectedValue]);
    const signedMessage = getTestSignedMessage(TEST_PRIVATE_KEY, {value: '0', to: TEST_TOKEN_ADDRESS, data: transferData});
    expect(getTransferCurrencyValueFrom(signedMessage)).to.deep.eq(CurrencyValue.fromWei(expectedValue, TEST_TOKEN_ADDRESS));
  });
});
