export interface Validator {
  validate: (value: string) => boolean | Promise<boolean>;
  errorMessage: string;
}

export const areValid = async (validators: Validator[], value: string): Promise<[boolean, string[]]> => {
  const errors = [];
  for (const validator of validators) {
    if (!await validator.validate(value)) {
      errors.push(validator.errorMessage);
    }
  }
  return [!(errors.length > 0), errors];
};
