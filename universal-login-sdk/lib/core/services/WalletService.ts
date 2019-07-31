import {ensure, ApplicationWallet} from '@universal-login/commons';
import UniversalLoginSDK from '../../api/sdk';
import {FutureWallet} from '../../api/FutureWalletFactory';

type WalletState = 'None' | 'Future' | 'Deployed';

export class WalletService {
  public applicationWallet?: FutureWallet | ApplicationWallet;
  public state: WalletState = 'None';

  constructor(private sdk: UniversalLoginSDK) {
  }

  walletDeployed(): boolean {
    return this.state === 'Deployed';
  }

  isAuthorized(): boolean {
    return this.walletDeployed();
  }

  async createFutureWallet(): Promise<FutureWallet> {
    const futureWallet = await this.sdk.createFutureWallet();
    this.setFutureWallet(futureWallet);
    return futureWallet;
  }

  setFutureWallet(applicationWallet: FutureWallet) {
    ensure(this.state === 'None', WalletOverriden);
    this.state = 'Future';
    this.applicationWallet = applicationWallet;
  }

  setDeployed(name: string) {
    ensure(this.state === 'Future', FutureWalletNotSet);
    const {contractAddress, privateKey} = this.applicationWallet!;
    this.state = 'Deployed';
    this.applicationWallet = {
      name,
      contractAddress,
      privateKey
    };
  }

  connect(applicationWallet: ApplicationWallet) {
    ensure(this.state === 'None', WalletOverriden);
    this.state = 'Deployed';
    this.applicationWallet = applicationWallet;
  }

  disconnect(): void {
    this.state = 'None';
    this.applicationWallet = undefined;
  }
}

type ErrorType = 'ApplicationWalletNotFound' | 'NotFound' | 'Overriden' | 'WalletOverriden' | 'FutureWalletNotSet' | 'NoSet';

export class WalletError extends Error {
errorType : ErrorType;

  constructor (message: string, errorType: ErrorType) {
    super(message);
    this.errorType = errorType;
    Object.setPrototypeOf(this, WalletError.prototype);
  }
}
export class NotSet extends WalletError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, NotSet.prototype);
  }
}

export class FutureWalletNotSet extends NotSet {
  constructor() {
    super('Future wallet was not set', 'NoSet');
    Object.setPrototypeOf(this, FutureWalletNotSet.prototype);
  }
}

export class Overriden extends WalletError {
  constructor (message: string, errorType: ErrorType) {
    super(message, errorType);
    this.errorType = errorType;
    Object.setPrototypeOf(this, Overriden.prototype);
  }
}

export class WalletOverriden extends Overriden {
  constructor() {
    super('Wallet cannot be overrided', 'Overriden');
    Object.setPrototypeOf(this, WalletOverriden.prototype);
  }
}