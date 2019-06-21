type ErrorType = 'ObserverStarted';

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
    super('DeploymentObserver is waiting for contract deployment. Stop observer to cancel waiting', 'ObserverStarted');
    Object.setPrototypeOf(this, DeploymentObserverConfilct.prototype);
  }
}

export class BalanceObserverConfilct extends Conflict {
  constructor () {
    super('Other wallet waiting for counterfactual deployment. Stop BalanceObserver to cancel old wallet instantialisation.', 'ObserverStarted');
    Object.setPrototypeOf(this, BalanceObserverConfilct.prototype);
  }
}
