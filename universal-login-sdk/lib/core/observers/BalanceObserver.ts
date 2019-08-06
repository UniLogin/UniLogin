import ObserverRunner from './ObserverRunner';
import {BalanceChecker, TokenDetails, TokenDetailsWithBalance} from '@universal-login/commons';
import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';

export class BalanceObserver extends ObserverRunner {
  private lastTokenBalances: TokenDetailsWithBalance[] = [];
  private callbacks: Function[] = [];

  constructor(private balanceChecker: BalanceChecker, private walletAddress: string, private tokenDetails: TokenDetails[], step: number = 500) {
    super();
    this.step = step;
  }

  async tick() {
    await this.checkBalanceNow();
  }

  async getBalances() {
    const tokenBalances: TokenDetailsWithBalance[] = [];
    for (const token of this.tokenDetails) {
      const balance = await this.balanceChecker.getBalance(this.walletAddress, token.address);
      tokenBalances.push({...token, balance});
    }
    return tokenBalances;
  }

  async checkBalanceNow() {
    const newTokenBalances = await this.getBalances();
    if (!deepEqual(this.lastTokenBalances, newTokenBalances)) {
      this.lastTokenBalances = clonedeep(newTokenBalances);
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
