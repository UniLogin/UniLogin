type ErrorType = 'ApplicationWalletNotFound' | 'NotFound';

export class WalletError extends Error {
  errorType : ErrorType;

  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}

export class NotFound extends WalletError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class ApplicationWalletNotFound extends NotFound {
  constructor() {
    super('Application wallet not found', 'ApplicationWalletNotFound');
    Object.setPrototypeOf(this, ApplicationWalletNotFound.prototype);
  }
}
