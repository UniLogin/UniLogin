import {utils} from 'ethers';
import {RefundPayerValidator} from '../validators/RefundPayerValidator';
import {RefundPayerStore} from '../../../integration/sql/services/RefundPayerStore';

export class ApiKeyHandler {
  constructor(
    private refundPayerValidator: RefundPayerValidator,
    private refundPayerStore: RefundPayerStore,
  ) {}

  async handle(apiKey: string | undefined, gasPrice: string): Promise<string | undefined> {
    if (utils.bigNumberify(gasPrice).isZero()) await this.refundPayerValidator.validate(apiKey);
    return apiKey && (await this.refundPayerStore.get(apiKey))?.id;
  }
}
