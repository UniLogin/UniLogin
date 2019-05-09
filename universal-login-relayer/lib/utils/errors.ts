type ErrorType = 'NotFound' | 'InvalidENSDomain' | 'PaymentError' | 'NotEnoughGas' | 'NotEnoughBalance' | 'InvalidExecution' | 'InvalidSignature' | 'DuplicatedSignature' | 'DuplicatedExecution';

export class RelayerError extends Error {
  errorType : ErrorType;

  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, RelayerError.prototype);
  }
}


export class ValidationFailed extends RelayerError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, ValidationFailed.prototype);
  }
}

export class InvalidSignature extends ValidationFailed {
  constructor (additionalMessage : string = '') {
    super(`Invalid signature ${additionalMessage}`, 'InvalidSignature');
    Object.setPrototypeOf(this, InvalidSignature.prototype);
  }
}

export class InvalidContract extends ValidationFailed {
  constructor (contractAddress: string) {
    super(`Invalid contract address: ${contractAddress}`, 'InvalidSignature');
    Object.setPrototypeOf(this, InvalidContract.prototype);
  }
}

export class NotFound extends RelayerError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}

export class InvalidExecution extends NotFound {
  constructor (hash: string) {
    super(`Could not find execution with hash: ${hash}` , 'InvalidExecution');
    Object.setPrototypeOf(this, InvalidExecution.prototype);
  }
}

export class InvalidENSDomain extends NotFound {
  constructor (ensDomain: string) {
    super(`ENS domain ${ensDomain} does not exist or is not compatible with Universal Login`, 'NotFound');
  }
}


export class PaymentError extends RelayerError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

export class NotEnoughGas extends PaymentError {
  constructor () {
    super('Not enough gas', 'NotEnoughGas');
    Object.setPrototypeOf(this, NotEnoughGas.prototype);
  }
}

export class NotEnoughBalance extends PaymentError {
  constructor () {
    super('Not enough ether', 'NotEnoughBalance');
    Object.setPrototypeOf(this, NotEnoughBalance.prototype);
  }
}

export class NotEnoughTokens extends PaymentError {
  constructor () {
    super('Not enough tokens', 'NotEnoughBalance');
    Object.setPrototypeOf(this, NotEnoughTokens.prototype);
  }
}


export class Conflict extends RelayerError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Conflict.prototype);
  }
}

export class DuplicatedSignature extends Conflict {
  constructor () {
    super('Signature already collected', 'DuplicatedSignature');
  }
}

export class DuplicatedExecution extends Conflict {
  constructor () {
    super('Execution request already processed', 'DuplicatedExecution');
  }
}