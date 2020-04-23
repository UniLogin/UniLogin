import {RefundPayerStore} from '../../../integration/sql/services/RefundPayerStore';

export class RefundPayerValidator {
  constructor(private store: RefundPayerStore) {}

  async isRefundPayer(apiKey: string) {
    const refundPayer = await this.store.get(apiKey);
    return !!refundPayer;
  }
}
