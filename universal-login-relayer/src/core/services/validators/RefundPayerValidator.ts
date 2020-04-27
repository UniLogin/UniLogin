import {RefundPayerStore} from '../../../integration/sql/services/RefundPayerStore';
import {InvalidApiKey} from '../../utils/errors';
import {ensure, ensureNotFalsy} from '@unilogin/commons';
import {utils} from 'ethers';

export class RefundPayerValidator {
  constructor(public store: RefundPayerStore) {}

  async isRefundPayer(apiKey: string) {
    const refundPayer = await this.store.get(apiKey);
    return !!refundPayer;
  }

  async validate(gasPrice: string, apiKey?: string) {
    if (utils.bigNumberify(gasPrice).isZero()) {
      ensureNotFalsy(apiKey, InvalidApiKey, 'undefined');
      ensure(await this.isRefundPayer(apiKey), InvalidApiKey, apiKey);
    }
  }
}
