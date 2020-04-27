import {RefundPayerStore} from '../../../integration/sql/services/RefundPayerStore';
import {InvalidApiKey} from '../../utils/errors';
import {ensure, ensureNotFalsy} from '@unilogin/commons';

export class RefundPayerValidator {
  constructor(private store: RefundPayerStore) {}

  async isRefundPayer(apiKey: string) {
    const refundPayer = await this.store.get(apiKey);
    return !!refundPayer;
  }

  async validate(apiKey?: string) {
    ensureNotFalsy(apiKey, InvalidApiKey, 'undefined');
    ensure(await this.isRefundPayer(apiKey), InvalidApiKey, apiKey);
  }
}
