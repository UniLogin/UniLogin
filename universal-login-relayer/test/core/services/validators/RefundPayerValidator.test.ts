import {expect} from 'chai';
import {RefundPayerValidator} from '../../../../src/core/services/validators/RefundPayerValidator';
import {TEST_REFUND_PAYER} from '../../../testhelpers/constants';

describe('UNIT: RefundPayerValidator', () => {
  const refundPayerStoreMock = {get: (apiKey: string) => Promise.resolve(apiKey === TEST_REFUND_PAYER.apiKey ? TEST_REFUND_PAYER : undefined)} as any;

  const validator = new RefundPayerValidator(refundPayerStoreMock);

  it('should resolve false if not valid apiKey', async () => {
    expect(await validator.isRefundPayer('not valid api key')).to.be.false;
  });

  it('should resolve true if valid apiKey', async () => {
    expect(await validator.isRefundPayer(TEST_REFUND_PAYER.apiKey)).to.be.true;
  });
});
