export interface Validator {
  validate: (value: string) => boolean | Promise<boolean>;
  errorMessage: string;
}

export const validateWithEvery = async (validators: Validator[], value: string): Promise<[boolean, string?]> => {
  for (const validator of validators) {
    if (!await validator.validate(value)) {
      return [false, validator.errorMessage];
    }
  }
  return [true];
};
