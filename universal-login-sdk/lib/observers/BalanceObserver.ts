import {providers} from 'ethers';
import {SupportedToken, ensure, findTokenWithRequiredBalance} from '@universal-login/commons';
import {BalanceObserverConfilct} from '../utils/errors';
import ObserverRunner from './ObserverRunner';

export type BalanceChangedCallback = (tokenAddress: string, contractAddress: string) => void;

export class BalanceObserver extends ObserverRunner {
  private contractAddress?: string;
  private callback?: BalanceChangedCallback;

  constructor(private supportedTokens: SupportedToken[], private provider: providers.Provider) {
    super();
  }

  async startAndSubscribe(contractAddress: string, callback: BalanceChangedCallback) {
    ensure(!this.isRunning(), BalanceObserverConfilct);
    this.contractAddress = contractAddress;
    this.callback = callback;
    this.start();
    return () => {
      this.contractAddress = undefined;
      this.stop();
    };
  }

  tick() {
    return this.checkBalance();
  }

  async checkBalance() {
    if (this.contractAddress) {
      const tokenAddress = await findTokenWithRequiredBalance(this.provider, this.supportedTokens, this.contractAddress);
      if (tokenAddress) {
        this.onBalanceChanged(this.contractAddress, tokenAddress);
      }
    }
  }

  onBalanceChanged(contractAddress: string, tokenAddress: string) {
    this.callback!(tokenAddress, contractAddress);
    this.contractAddress = undefined;
    this.stop();
  }
}
