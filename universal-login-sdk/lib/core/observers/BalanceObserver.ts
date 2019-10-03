import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';
import {BalanceChecker, TokenDetailsWithBalance} from '@universal-login/commons';
import ObserverRunner from './ObserverRunner';
import {TokensDetailsStore} from '../services/TokensDetailsStore';

export type OnBalanceChange = (data: TokenDetailsWithBalance[]) => void;

export class BalanceObserver extends ObserverRunner {
  private lastTokenBalances: TokenDetailsWithBalance[] = [];
  private callbacks: OnBalanceChange[] = [];

  constructor(private balanceChecker: BalanceChecker, private walletAddress: string, private tokenDetailsStore: TokensDetailsStore, tick: number) {
    super();
    this.tick = tick;
  }

  async execute() {
    await this.checkBalanceNow();
  }

  async getBalances() {
    const tokenBalances: TokenDetailsWithBalance[] = [];
    for (const token of this.tokenDetailsStore.tokensDetails) {
      const balance = await this.balanceChecker.getBalance(this.walletAddress, token.address);
      tokenBalances.push({...token, balance});
    }
    return tokenBalances;
  }

  async checkBalanceNow() {
    const newTokenBalances = await this.getBalances();
    if (!deepEqual(this.lastTokenBalances, newTokenBalances)) {
      this.lastTokenBalances = clonedeep(newTokenBalances);
      this.callbacks.forEach((callback) => callback(this.lastTokenBalances));
    }
  }

  subscribe(callback: OnBalanceChange) {
    this.callbacks.push(callback);
    if (this.isStopped()) {
      this.start();
    }
    callback(this.lastTokenBalances);

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
