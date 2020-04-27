import {RefundPayerStore} from '../../../integration/sql/services/RefundPayerStore';
import {InvalidApiKey} from '../../utils/errors';
import {ensure} from '@unilogin/commons';

export class RefundPayerValidator {
  constructor(private store: RefundPayerStore) {}

  async isRefundPayer(apiKey: string) {
    const refundPayer = await this.store.get(apiKey);
    return !!refundPayer;
  }

  async validate(apiKey: string) {
    ensure(await this.isRefundPayer(apiKey), InvalidApiKey, apiKey);
  }
}
