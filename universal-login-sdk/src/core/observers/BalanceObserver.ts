import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';
import {Callback} from 'reactive-properties';
import {providers} from 'ethers';
import {BalanceChecker, TokenDetailsWithBalance, Nullable, ensureNotNullish, ETHER_NATIVE_TOKEN, ProviderService, isAddressIncludedInLog} from '@unilogin/commons';
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

  async getErc20ContractsWithChangedBalances() {
    const ierc20adresses = this.tokenDetailsStore.tokensDetails
      .map(token => token.address)
      .filter(address => address !== ETHER_NATIVE_TOKEN.address);

    if (ierc20adresses.length === 0) return [];

    const filter = {
      address: ierc20adresses,
      fromBlock: this.blockNumberState.get(),
      toBlock: 'latest',
      topics: [IERC20Interface.events['Transfer'].topic],
    };
    const logs: providers.Log[] = await this.providerService.getLogs(filter);
    const filteredLogs = logs.filter(isAddressIncludedInLog(this.walletAddress));
    const changedAddresses = filteredLogs.reduce((acc, current) => acc.includes(current.address) ? acc : [...acc, current.address], [] as string[]);
    return changedAddresses;
  }

  async getBalances() {
    if (this.isInitialCall()) {
      return this.getInitialTokenBalances();
    }
    const changedErc20contracts = await this.getErc20ContractsWithChangedBalances();
    const addressesToUpdate = [ETHER_NATIVE_TOKEN.address, ...changedErc20contracts];
    const tokenBalances: TokenDetailsWithBalance[] = [];
    for (const token of this.lastTokenBalances) {
      tokenBalances.push(await this.lazyGetTokenWithBalance(token, addressesToUpdate));
    }
    return tokenBalances;
  }

  private isInitialCall() {
    return this.lastTokenBalances.length === 0;
  }

  private async lazyGetTokenWithBalance(token: TokenDetailsWithBalance, addressesToUpdate: string[]) {
    const balance = addressesToUpdate.includes(token.address) ? await this.balanceChecker.getBalance(this.walletAddress, token.address) : token.balance;
    return {...token, balance};
  }

  private async getInitialTokenBalances() {
    const tokenBalances: TokenDetailsWithBalance[] = [];
    const addresses = this.tokenDetailsStore.tokensDetails.map(token => token.address);
    const tokensToUpdate = this.tokenDetailsStore.tokensDetails.filter(token => addresses.includes(token.address));
    for (const token of tokensToUpdate) {
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
