type ErrorType = 'InvalidProvider' | 'UnexpectedWalletState' | 'Web3ProviderNotFound';

export class UlWeb3Error extends Error {
  errorType: ErrorType;

  constructor(message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, UlWeb3Error.prototype);
  }
}

export class ValidationFailed extends UlWeb3Error {
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidProvider extends ValidationFailed {
  constructor(providerName: string) {
    super(`Invalid provider: ${providerName}`, 'InvalidProvider');
    Object.setPrototypeOf(this, InvalidProvider.prototype);
  }
}

export class Web3ProviderNotFound extends ValidationFailed {
  constructor() {
    super('Browser Web3 provider not found', 'Web3ProviderNotFound');
    Object.setPrototypeOf(this, Web3ProviderNotFound.prototype);
  }
}

export class UnexpectedWalletState extends ValidationFailed {
  constructor(walletState: string) {
    super(`Unexpected wallet state: ${walletState}`, 'UnexpectedWalletState');
    Object.setPrototypeOf(this, UnexpectedWalletState.prototype);
  }
}
