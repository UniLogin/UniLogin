type ErrorType = 'DeploymentObserverConflict' | 'BalanceObserverConfilct' | 'InvalidBytecode' | 'RelayerConfigNotFound';

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

export class DeploymentObserverConfilct extends Conflict {
  constructor () {
    super('DeploymentObserver is waiting for contract deployment. Stop observer to cancel waiting', 'DeploymentObserverConfilct');
    Object.setPrototypeOf(this, DeploymentObserverConfilct.prototype);
  }
}

export class BalanceObserverConfilct extends Conflict {
  constructor () {
    super('Other wallet waiting for counterfactual deployment. Stop BalanceObserver to cancel old wallet instantialisation.', 'BalanceObserverConfilct');
    Object.setPrototypeOf(this, BalanceObserverConfilct.prototype);
  }
}

export class ValidationFailed extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidBytecode extends ValidationFailed {
  constructor () {
    super('Proxy Bytecode is not supported by relayer', 'InvalidBytecode');
    Object.setPrototypeOf(this, BalanceObserverConfilct.prototype);
  }
}

export class NotFound extends SDKError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class RelayerConfigNotFound extends NotFound {
  constructor () {
    super('Relayer configuration not yet loadedr', 'RelayerConfigNotFound');
    Object.setPrototypeOf(this, RelayerConfigNotFound.prototype);
  }
}
