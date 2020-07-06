import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';
import {Callback} from 'reactive-properties';
import {providers} from 'ethers';
import {BalanceChecker, TokenDetailsWithBalance, Nullable, ensureNotNullish, ETHER_NATIVE_TOKEN, ProviderService} from '@unilogin/commons';
import {IERC20Interface} from '@unilogin/contracts';
import {TokensDetailsStore} from '../services/TokensDetailsStore';
import {BlockNumberState} from '../states/BlockNumberState';
import {InvalidObserverState} from '../utils/errors';

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
    private providerService: ProviderService,
  ) {}

  async execute() {
    await this.checkBalanceNow();
  }

  async isErc20BalancesChanged() {
    const ierc20adresses = this.tokenDetailsStore.tokensDetails
      .map(token => token.address)
      .filter(address => address !== ETHER_NATIVE_TOKEN.address);

    if (ierc20adresses.length === 0) return false;

    const filter = {address: ierc20adresses.toString(), fromBlock: this.blockNumberState.get(), toBlock: 'latest', topics: [IERC20Interface.events['Transfer'].topic]};
    const logs: providers.Log[] = await this.providerService.getLogs(filter);
    const filteredLogs = logs.filter(log => {
      const {values} = IERC20Interface.parseLog(log);
      return values.from === this.walletAddress || values.to === this.walletAddress;
    });
    return filteredLogs.length > 0;
  }

  async getBalances() {
    const isErc20BalancesChanged = await this.isErc20BalancesChanged();

    if (isErc20BalancesChanged || this.lastTokenBalances.length === 0) {
      const tokenBalances: TokenDetailsWithBalance[] = [];
      for (const token of this.tokenDetailsStore.tokensDetails) {
        const balance = await this.balanceChecker.getBalance(this.walletAddress, token.address);
        tokenBalances.push({...token, balance});
      }
      return tokenBalances;
    } else {
      const tokenBalances = this.lastTokenBalances.filter(({address}) => address !== ETHER_NATIVE_TOKEN.address);
      const ethBalance = await this.balanceChecker.getBalance(this.walletAddress, ETHER_NATIVE_TOKEN.address);
      tokenBalances.push({...ETHER_NATIVE_TOKEN, balance: ethBalance});
      return tokenBalances;
    }
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
    callback(this.lastTokenBalances);

    if (!this.unsubscribeBlockNumber) {
      this.checkBalanceNow();
      this.unsubscribeBlockNumber = this.blockNumberState.subscribe(() => this.checkBalanceNow());
    }

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.stop();
      }
    };
    return unsubscribe;
  }

  stop() {
    ensureNotNullish(this.unsubscribeBlockNumber, InvalidObserverState);
    this.unsubscribeBlockNumber();
    this.unsubscribeBlockNumber = null;
    this.lastTokenBalances = [];
  }
}
