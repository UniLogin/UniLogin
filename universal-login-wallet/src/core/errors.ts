type ErrorType = 'ApplicationWalletNotFound' | 'NotFound' | 'Overriden' | 'WalletOverriden' | 'FutureWalletNotSet' | 'NoSet';

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

export class NotSet extends WalletError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotSet.prototype);
  }
}

export class Overriden extends WalletError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Overriden.prototype);
  }
}

export class ApplicationWalletNotFound extends NotFound {
  constructor() {
    super('Application wallet not found', 'ApplicationWalletNotFound');
    Object.setPrototypeOf(this, ApplicationWalletNotFound.prototype);
  }
}

export class WalletOverriden extends Overriden {
  constructor() {
    super('Wallet cannot be overrided', 'Overriden');
    Object.setPrototypeOf(this, WalletOverriden.prototype);
  }
}

export class FutureWalletNotSet extends NotSet {
  constructor() {
    super('Future wallet was not set', 'NoSet');
    Object.setPrototypeOf(this, FutureWalletNotSet.prototype);
  }
}
