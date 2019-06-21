type ErrorType = 'ConcurrentDeployment' | 'UnsupportedBytecode' | 'MissingConfiguration' | 'TransactionHashNotFound' | 'TimeoutError';

export class SDKError extends Error {
  errorType : ErrorType;

  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, SDKError.prototype);
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

export class ValidationFailed extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class UnsupportedBytecode extends ValidationFailed {
  constructor () {
    super('Proxy Bytecode is not supported by relayer', 'UnsupportedBytecode');
    Object.setPrototypeOf(this, UnsupportedBytecode.prototype);
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
    super('Relayer configuration not yet loadedr', 'MissingConfiguration');
    Object.setPrototypeOf(this, MissingConfiguration.prototype);
  }
}
export class TransactionHashNotFound extends NotFound {
  constructor () {
    super('Transaction hash is not found in Message Status', 'TransactionHashNotFound');
    Object.setPrototypeOf(this, TransactionHashNotFound.prototype);
  }
}

export class TimeoutError extends SDKError {
  constructor () {
    super('Timeout exceeded', 'TimeoutError');
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
