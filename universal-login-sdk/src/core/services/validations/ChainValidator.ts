import {TransferDetails} from '@unilogin/commons';
import {Validator, TransferErrors} from './Validator';

export class ChainValidator implements Validator<TransferDetails> {
  constructor(private readonly validators: Validator<TransferDetails>[]) {
  }

  async validate(subject: TransferDetails, errors: TransferErrors) {
    for (const validator of this.validators) {
      await validator.validate(subject, errors);
    }
  }
}
