type ErrorType = 'InvalidProvider' | 'MissingParameter' | 'UnexpectedWalletState' | 'Web3ProviderNotFound';

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

export class UnexpectedWalletState extends ValidationFailed {
  constructor(walletState: string) {
    super(`Unexpected wallet state: ${walletState}`, 'UnexpectedWalletState');
    Object.setPrototypeOf(this, UnexpectedWalletState.prototype);
  }
}

export class MissingParameter extends ValidationFailed {
  constructor(parameterName: string) {
    super(`Missing parameter: ${parameterName}`, 'MissingParameter');
    Object.setPrototypeOf(this, MissingParameter.prototype);
  }
}

export const isRandomInfuraError = (errorMessage?: string) => errorMessage === 'invalid response - 0';
