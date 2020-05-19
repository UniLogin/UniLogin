import {expect} from 'chai';
import {SupportedTokensValidator} from '../../../../src/core/services/validators/SupportedTokensValidator';
import {ETHER_NATIVE_TOKEN, SignedMessage, TEST_TOKEN_ADDRESS} from '@unilogin/commons';

describe('UNIT: SupportedTokensValidator', () => {
  const supportedTokensValidator = new SupportedTokensValidator([{address: ETHER_NATIVE_TOKEN.address}]);

  it('won`t throw if token is supported', () => {
    expect(supportedTokensValidator.validate({gasToken: ETHER_NATIVE_TOKEN.address} as SignedMessage)).to.not.throw;
  });

  it('throws UnsupportedToken error if token is not supported', () => {
    expect(() => supportedTokensValidator.validate({gasToken: TEST_TOKEN_ADDRESS} as SignedMessage)).to.throw(`Token: ${TEST_TOKEN_ADDRESS} is not supported.`);
  });
});
