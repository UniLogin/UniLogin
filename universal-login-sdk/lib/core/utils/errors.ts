type ErrorType =
  'InsufficientGas' |
  'WalletNotFound' |
  'ConcurrentAuthorisation' |
  'ConcurrentDeployment' |
  'UnsupportedBytecode' |
  'InvalidAddress' |
  'MissingConfiguration' |
  'TransactionHashNotFound' |
  'TokenNotFound' |
  'MissingMessageHash' |
  'InvalidPassphrase' |
  'TimeoutError' |
  'InvalidEvent' |
  'Overridden' |
  'WalletOverridden' |
  'FutureWalletNotSet' |
  'InvalidContract' |
  'NoSet' |
  'UnexpectedError' |
  'InvalidGasLimit';

export class SDKError extends Error {
  errorType : ErrorType;

  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, SDKError.prototype);
  }
}

export class UnexpectedError extends SDKError {
  constructor(message: string) {
    super(`Unexpected error: ${message}`, 'UnexpectedError');
    Object.setPrototypeOf(this, UnexpectedError.prototype);
  }
}

export class Conflict extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Conflict.prototype);
  }
}

export class ConcurrentDeployment extends Conflict {
  constructor () {
    super('Other wallet waiting for counterfactual deployment. Stop observer to cancel old wallet instantialisation.', 'ConcurrentDeployment');
    Object.setPrototypeOf(this, ConcurrentDeployment.prototype);
  }
}

export class ConcurrentAuthorisation extends Conflict {
  constructor () {
    super('Another wallet is subscribed for authorisations', 'ConcurrentAuthorisation');
    Object.setPrototypeOf(this, ConcurrentAuthorisation.prototype);
  }
}

export class ValidationFailed extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidAddress extends ValidationFailed {
  constructor (address: string) {
    super(`Address ${address} is not valid`, 'InvalidAddress');
    Object.setPrototypeOf(this, InvalidAddress.prototype);
  }
}

export class InvalidContract extends ValidationFailed {
  constructor () {
    super('Contract is not valid', 'InvalidContract');
    Object.setPrototypeOf(this, InvalidContract.prototype);
  }
}

export class UnsupportedBytecode extends ValidationFailed {
  constructor () {
    super('Proxy Bytecode is not supported by relayer', 'UnsupportedBytecode');
    Object.setPrototypeOf(this, UnsupportedBytecode.prototype);
  }
}

export class InvalidEvent extends ValidationFailed {
  constructor (eventType: string) {
    super(`Unknown event type: ${eventType}`, 'InvalidEvent');
    Object.setPrototypeOf(this, InvalidEvent.prototype);
  }
}

export class InvalidPassphrase extends ValidationFailed {
  constructor () {
    super('Passphrase is not valid', 'InvalidPassphrase');
    Object.setPrototypeOf(this, InvalidPassphrase.prototype);
  }
}

export class InsufficientGas extends ValidationFailed {
  constructor (message: string) {
    super(`Insufficient Gas. ${message}`, 'InsufficientGas');
    Object.setPrototypeOf(this, InsufficientGas.prototype);
  }
}

export class InvalidGasLimit extends ValidationFailed {
  constructor (message: string) {
    super(`Invalid gas limit. ${message}`, 'InvalidGasLimit');
    Object.setPrototypeOf(this, InvalidGasLimit.prototype);
  }
}

export class NotFound extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class MissingConfiguration extends NotFound {
  constructor () {
    super('Relayer configuration not yet loaded', 'MissingConfiguration');
    Object.setPrototypeOf(this, MissingConfiguration.prototype);
  }
}

export class TransactionHashNotFound extends NotFound {
  constructor () {
    super('Transaction hash is not found in Message Status', 'TransactionHashNotFound');
    Object.setPrototypeOf(this, TransactionHashNotFound.prototype);
  }
}

export class MissingMessageHash extends NotFound {
  constructor () {
    super('Message hash is missing in Message Status', 'MissingMessageHash');
    Object.setPrototypeOf(this, MissingMessageHash.prototype);
  }
}

export class WalletNotFound extends NotFound {
  constructor() {
    super('Wallet not found', 'WalletNotFound');
    Object.setPrototypeOf(this, WalletNotFound.prototype);
  }
}

export class TokenNotFound extends NotFound {
  constructor(tokenAddress: string) {
    super(`Token not found (address = ${tokenAddress})`, 'TokenNotFound');
    Object.setPrototypeOf(this, TokenNotFound.prototype);
  }
}

export class TimeoutError extends SDKError {
  constructor () {
    super('Timeout exceeded', 'TimeoutError');
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class NotSet extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotSet.prototype);
  }
}

export class FutureWalletNotSet extends NotSet {
  constructor() {
    super('Future wallet was not set', 'FutureWalletNotSet');
    Object.setPrototypeOf(this, FutureWalletNotSet.prototype);
  }
}

export class Overridden extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Overridden.prototype);
  }
}

export class WalletOverridden extends Overridden {
  constructor() {
    super('Wallet cannot be overridded', 'WalletOverridden');
    Object.setPrototypeOf(this, WalletOverridden.prototype);
  }
}
