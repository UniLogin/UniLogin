import {expect} from 'chai';
import {RefundPayerValidator} from '../../../../src/core/services/validators/RefundPayerValidator';
import {TEST_REFUND_PAYER} from '../../../testhelpers/constants';

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
    describe('gas price eq 0', () => {
      it('should reject if apiKey is not valid', async () => {
        await expect(validator.validate('0', 'not valid api key')).to.be.rejectedWith('Invalid api key: not valid api key');
      });

      it('should reject if apiKey is not valid', async () => {
        await expect(validator.validate('0', undefined)).to.be.rejectedWith('Invalid api key: undefined');
      });

      it('should resolve with valid apiKey', async () => {
        await expect(validator.validate('0', TEST_REFUND_PAYER.apiKey)).to.be.fulfilled;
      });
    });

    it('should resolve with gas prices gt than 0', async () => {
      await expect(validator.validate('1', undefined)).to.be.fulfilled;
      await expect(validator.validate('1', 'not valid api key')).to.be.fulfilled;
      await expect(validator.validate('1', TEST_REFUND_PAYER.apiKey)).to.be.fulfilled;
    });
  });
});
