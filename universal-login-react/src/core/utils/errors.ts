type ErrorType = 'InvalidNumber' | 'InvalidTransferDetails' | 'IpGeolocationError';

export class ReactError extends Error {
  errorType: ErrorType;

  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ReactError.prototype);
  }
}

export class ValidationFailed extends ReactError {
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidNumber extends ValidationFailed {
  constructor(additionalMessage: string = '') {
    super(`Invalid number. ${additionalMessage}`, 'InvalidNumber');
    Object.setPrototypeOf(this, InvalidNumber.prototype);
  }
}

export class InvalidTransferDetails extends ValidationFailed {
  constructor() {
    super('Invalid transfer details.', 'InvalidTransferDetails');
    Object.setPrototypeOf(this, InvalidTransferDetails.prototype);
  }
}

export class IPGeolocationError extends ReactError {
  constructor(message: string, wrappedError: any) {
    const reason = wrappedError instanceof Error ? wrappedError.message : JSON.stringify(wrappedError);
    super(`${message}. Reason: ${reason}`, 'IpGeolocationError');
    Object.setPrototypeOf(this, IPGeolocationError.prototype);
  }
}
