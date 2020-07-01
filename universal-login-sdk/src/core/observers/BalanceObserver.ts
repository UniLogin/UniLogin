import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';
import {BalanceChecker, TokenDetailsWithBalance, Nullable} from '@unilogin/commons';
import {TokensDetailsStore} from '../services/TokensDetailsStore';
import {BlockNumberState} from '../states/BlockNumberState';
import {Callback} from 'reactive-properties';

export type OnBalanceChange = (data: TokenDetailsWithBalance[]) => void;

export class BalanceObserver {
  private lastTokenBalances: TokenDetailsWithBalance[] = [];
  private callbacks: OnBalanceChange[] = [];
  private unsubscribeBlockNumber: Nullable<Callback> = null;

  constructor(
    private balanceChecker: BalanceChecker,
    private walletAddress: string,
    private tokenDetailsStore: TokensDetailsStore,
    private blockNumberState: BlockNumberState,
  ) {}

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
    if (!this.unsubscribeBlockNumber) {
      this.unsubscribeBlockNumber = this.blockNumberState.subscribe(() => this.checkBalanceNow());
    }
    this.callbacks.push(callback);

    callback(this.lastTokenBalances);

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.unsubscribeBlockNumber?.();
        this.unsubscribeBlockNumber = null;
        this.lastTokenBalances = [];
      }
    };
    return unsubscribe;
  }
}
