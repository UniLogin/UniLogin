type ErrorType = 'InvalidContract' | 'NotEnoughTokens';

export class ValidationFailed extends Error {
  errorType: ErrorType;
  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidContract extends ValidationFailed {
  constructor(contractAddress: string) {
    super(`Invalid contract address: ${contractAddress}`, 'InvalidContract');
    Object.setPrototypeOf(this, InvalidContract.prototype);
  }
}

export class NotEnoughTokens extends ValidationFailed {
  constructor() {
    super('Not enough tokens', 'NotEnoughTokens');
    Object.setPrototypeOf(this, NotEnoughTokens.prototype);
  }
}
