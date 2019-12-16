export type TransferErrors = Record<string, string[]>;

export class Validator<T> {
  validate(subject: T, errors: TransferErrors) {
  }
}
