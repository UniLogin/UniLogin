export type TransferErrors = Record<string, string[]>;

export interface Validator<T> {
  validate(subject: T, errors: TransferErrors): Promise<void>;
}
