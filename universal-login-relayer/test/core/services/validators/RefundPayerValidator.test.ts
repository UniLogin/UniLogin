import {expect} from 'chai';
import {TEST_REFUND_PAYER} from '@unilogin/commons';
import {RefundPayerValidator} from '../../../../src/core/services/validators/RefundPayerValidator';

describe('UNIT: RefundPayerValidator', () => {
  const refundPayerStoreMock = {get: (apiKey: string) => Promise.resolve(apiKey === TEST_REFUND_PAYER.apiKey ? TEST_REFUND_PAYER : undefined)} as any;

  const validator = new RefundPayerValidator(refundPayerStoreMock);

  describe('isRefundPayer', () => {
    it('should resolve false if not valid apiKey', async () => {
      expect(await validator.isRefundPayer('not valid api key')).to.be.false;
    });

    it('should resolve true if valid apiKey', async () => {
      expect(await validator.isRefundPayer(TEST_REFUND_PAYER.apiKey)).to.be.true;
    });
  });

  describe('validate', () => {
    it('should reject if apiKey is not valid', async () => {
      await expect(validator.validate('not valid api key')).to.be.rejectedWith('Invalid api key: not valid api key');
    });

    it('should reject if apiKey is undefined', async () => {
      await expect(validator.validate(undefined)).to.be.rejectedWith('Invalid api key: undefined');
    });

    it('should resolve with valid apiKey', async () => {
      await expect(validator.validate(TEST_REFUND_PAYER.apiKey)).to.be.fulfilled;
    });
  });
});
