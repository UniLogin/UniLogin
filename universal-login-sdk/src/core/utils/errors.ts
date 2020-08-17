type ErrorType =
  'ApiKeyMissing' |
  'InsufficientGas' |
  'WalletNotFound' |
  'ConcurrentAuthorisation' |
  'ConcurrentDeployment' |
  'UnsupportedBytecode' |
  'InvalidAddressOrEnsName' |
  'InvalidAmount' |
  'InvalidAmountAndRecipient' |
  'TransactionHashNotFound' |
  'TokenNotFound' |
  'MissingMessageHash' |
  'MissingParameter' |
  'InvalidPassphrase' |
  'InvalidWalletState' |
  'TimeoutError' |
  'InvalidEvent' |
  'Overridden' |
  'WalletOverridden' |
  'InvalidContract' |
  'InvalidENSRecord' |
  'NoSet' |
  'UnexpectedError' |
  'InvalidGasLimit' |
  'InvalidObserverState' |
  'SavingFutureWalletFailed' |
  'InvalidPrivateKey';

export class SDKError extends Error {
  errorType: ErrorType;

  constructor(message: string, errorType: ErrorType) {
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
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Conflict.prototype);
  }
}

export class ConcurrentDeployment extends Conflict {
  constructor() {
    super('Other wallet waiting for counterfactual deployment. Stop observer to cancel old wallet instantialisation.', 'ConcurrentDeployment');
    Object.setPrototypeOf(this, ConcurrentDeployment.prototype);
  }
}

export class ConcurrentAuthorisation extends Conflict {
  constructor() {
    super('Another wallet is subscribed for authorisations', 'ConcurrentAuthorisation');
    Object.setPrototypeOf(this, ConcurrentAuthorisation.prototype);
  }
}

export class ValidationFailed extends SDKError {
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidAddressOrEnsName extends ValidationFailed {
  constructor(addressOrEnsName: string) {
    super(`${addressOrEnsName} is not valid`, 'InvalidAddressOrEnsName');
    Object.setPrototypeOf(this, InvalidAddressOrEnsName.prototype);
  }
}

export class InvalidENSRecord extends ValidationFailed {
  constructor(ensName: string) {
    super(`Unable to resolve ENS name: ${ensName}`, 'InvalidENSRecord');
    Object.setPrototypeOf(this, InvalidENSRecord.prototype);
  }
}

export class InvalidAmount extends ValidationFailed {
  constructor(amount: string) {
    super(`Amount ${amount} is not valid`, 'InvalidAmount');
    Object.setPrototypeOf(this, InvalidAmount.prototype);
  }
}

export class InvalidAmountAndRecipient extends ValidationFailed {
  constructor(amount: string, recipient: string) {
    super(`Amount ${amount} and recipient ${recipient} is not valid`, 'InvalidAmountAndRecipient');
    Object.setPrototypeOf(this, InvalidAmountAndRecipient.prototype);
  }
}

export class InvalidContract extends ValidationFailed {
  constructor() {
    super('Contract is not valid', 'InvalidContract');
    Object.setPrototypeOf(this, InvalidContract.prototype);
  }
}

export class UnsupportedBytecode extends ValidationFailed {
  constructor() {
    super('Proxy Bytecode is not supported by relayer', 'UnsupportedBytecode');
    Object.setPrototypeOf(this, UnsupportedBytecode.prototype);
  }
}

export class InvalidEvent extends ValidationFailed {
  constructor(eventType: string) {
    super(`Unknown event type: ${eventType}`, 'InvalidEvent');
    Object.setPrototypeOf(this, InvalidEvent.prototype);
  }
}

export class InvalidPrivateKey extends ValidationFailed {
  constructor(contractAddress: string) {
    super(`Private key is not contract's ${contractAddress} owner`, 'InvalidPrivateKey');
    Object.setPrototypeOf(this, InvalidPrivateKey.prototype);
  }
}

export class InvalidPassphrase extends ValidationFailed {
  constructor() {
    super('Passphrase is not valid', 'InvalidPassphrase');
    Object.setPrototypeOf(this, InvalidPassphrase.prototype);
  }
}

export class InvalidWalletState extends ValidationFailed {
  constructor(expectedState: string, currentState: string) {
    super(`Wallet state is ${currentState}, but expected ${expectedState}`, 'InvalidWalletState');
    Object.setPrototypeOf(this, InvalidWalletState.prototype);
  }
}

export class InsufficientGas extends ValidationFailed {
  constructor(message: string) {
    super(`Insufficient Gas. ${message}`, 'InsufficientGas');
    Object.setPrototypeOf(this, InsufficientGas.prototype);
  }
}

export class InvalidGasLimit extends ValidationFailed {
  constructor(message: string) {
    super(`Invalid gas limit. ${message}`, 'InvalidGasLimit');
    Object.setPrototypeOf(this, InvalidGasLimit.prototype);
  }
}

export class NotFound extends SDKError {
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class MissingParameter extends NotFound {
  constructor(parameterName: string) {
    super(`Missing parameter: ${parameterName}`, 'MissingParameter');
    Object.setPrototypeOf(this, MissingParameter.prototype);
  }
}

export class ApiKeyMissing extends NotFound {
  constructor() {
    super('Api key is missing in SDK configuration', 'ApiKeyMissing');
    Object.setPrototypeOf(this, ApiKeyMissing.prototype);
  }
}

export class TransactionHashNotFound extends NotFound {
  constructor() {
    super('Transaction hash is not found in Message Status', 'TransactionHashNotFound');
    Object.setPrototypeOf(this, TransactionHashNotFound.prototype);
  }
}

export class MissingMessageHash extends NotFound {
  constructor() {
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
  constructor() {
    super('Timeout exceeded', 'TimeoutError');
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export class Overridden extends SDKError {
  constructor(message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Overridden.prototype);
  }
}

export class WalletOverridden extends Overridden {
  constructor() {
    super('Wallet cannot be overridden', 'WalletOverridden');
    Object.setPrototypeOf(this, WalletOverridden.prototype);
  }
}

export class InvalidObserverState extends Overridden {
  constructor() {
    super('Observer not yet started', 'InvalidObserverState');
    Object.setPrototypeOf(this, InvalidObserverState.prototype);
  }
}

export class SavingFutureWalletFailed extends SDKError {
  constructor() {
    super('Saving future wallet failed', 'SavingFutureWalletFailed');
    Object.setPrototypeOf(this, SavingFutureWalletFailed.prototype);
  }
}
