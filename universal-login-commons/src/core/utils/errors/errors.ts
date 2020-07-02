type ErrorType = 'InvalidContract' | 'NotEnoughTokens';

export class ValidationError extends Error {
  errorType: ErrorType;
  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class InvalidContract extends ValidationError {
  constructor(contractAddress: string) {
    super(`Invalid contract address: ${contractAddress}`, 'InvalidContract');
    Object.setPrototypeOf(this, InvalidContract.prototype);
  }
}

export class PaymentError extends Error {
  errorType: ErrorType;
  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

export class NotEnoughTokens extends PaymentError {
  constructor() {
    super('Not enough tokens', 'NotEnoughTokens');
    Object.setPrototypeOf(this, NotEnoughTokens.prototype);
  }
}

export class InvalidHexString extends Error {
  constructor(hexString: string) {
    super(`${hexString} is not a valid hex string`);
    Object.setPrototypeOf(this, InvalidHexString.prototype);
  }
}

export class InvalidSignatureLength extends Error {
  constructor(hexString: string) {
    super(`${hexString} length should be 132`);
    Object.setPrototypeOf(this, InvalidSignatureLength.prototype);
  }
}

export class InvalidNetwork extends Error {
  constructor() {
    super('Invalid network');
    Object.setPrototypeOf(this, InvalidNetwork.prototype);
  }
}
