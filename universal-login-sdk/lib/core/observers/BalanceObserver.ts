import ObserverRunner from './ObserverRunner';
import {BalanceChecker, TokenDetails, TokenDetailsWithBalance} from '@universal-login/commons';
import deepEqual = require('deep-equal');

export class BalanceObserver extends ObserverRunner {
  private lastTokenBalances: TokenDetailsWithBalance[] = [];
  private callbacks: Function[] = [];
  constructor(private balanceChecker: BalanceChecker, private walletAddress: string, private supportedTokens: TokenDetails[]) {
    super();
    this.step = 500;
  }

  async tick() {
    await this.checkBalanceNow();
  }

  async getBalances() {
    const tokenBalances: TokenDetailsWithBalance[] = [];
    for (const supportedToken of this.supportedTokens) {
      const balance = await this.balanceChecker.getBalance(this.walletAddress, supportedToken.address);
      tokenBalances.push({...supportedToken, balance: balance.toString()});
    }
    return tokenBalances;
  }

  async checkBalanceNow() {
    const newTokenBalances = await this.getBalances();
    if (!deepEqual(this.lastTokenBalances, newTokenBalances)) {
      this.lastTokenBalances = newTokenBalances.map((tokenBalance: TokenDetailsWithBalance) => ({...tokenBalance}));
      this.callbacks.forEach((callback) => callback(newTokenBalances));
    }
    return this.lastTokenBalances;
  }

  subscribe(callback: Function) {
    this.callbacks.push(callback);

    this.isRunning() ? callback(this.lastTokenBalances) : this.start();

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.stop();
        this.lastTokenBalances = [];
      }
    };
    return unsubscribe;
  }
}
