import {providers} from 'ethers';
import {SupportedToken, ensure, RequiredBalanceChecker, BalanceChecker} from '@universal-login/commons';
import {ConcurrentDeployment} from '../utils/errors';
import ObserverRunner from './ObserverRunner';

export type ReadyToDeployCallback = (tokenAddress: string, contractAddress: string) => void;

export class BalanceObserver extends ObserverRunner {
  private contractAddress?: string;
  private callback?: ReadyToDeployCallback;
  private requiredBalanceChecker: RequiredBalanceChecker;
  private balanceChecker: BalanceChecker;

  constructor(private supportedTokens: SupportedToken[], provider: providers.Provider) {
    super();
    this.balanceChecker = new BalanceChecker(provider);
    this.requiredBalanceChecker = new RequiredBalanceChecker(this.balanceChecker);
  }

  async startAndSubscribe(contractAddress: string, callback: ReadyToDeployCallback) {
    ensure(!this.isRunning(), ConcurrentDeployment);
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
      const tokenAddress = await this.requiredBalanceChecker.findTokenWithRequiredBalance(this.supportedTokens, this.contractAddress);
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
