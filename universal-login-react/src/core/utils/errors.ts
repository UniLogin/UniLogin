type ErrorType = 'InvalidNumber';

export class ReactError extends Error {
  errorType : ErrorType;
  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ReactError.prototype);
  }
}

export class ValidationFailed extends ReactError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidNumber extends ValidationFailed {
  constructor (additionalMessage : string = '') {
    super(`Invalid number. ${additionalMessage}`, 'InvalidNumber');
    Object.setPrototypeOf(this, InvalidNumber.prototype);
  }
}
