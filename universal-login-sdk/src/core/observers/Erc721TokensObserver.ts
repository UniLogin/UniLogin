import deepEqual from 'deep-equal';
import clonedeep from 'lodash.clonedeep';
import {IErc721Token, Erc721TokensService, IBasicToken as IBasicErc721Token} from '@unilogin/commons';
import ObserverRunner from './ObserverRunner';

export type OnErc721TokensChange = (data: IErc721Token[]) => void;

export class Erc721TokensObserver extends ObserverRunner {
  private lastBasicErc721Tokens: IBasicErc721Token[] | undefined = undefined;
  private callbacks: OnErc721TokensChange[] = [];

  constructor(private walletAddress: string, private erc721TokensService: Erc721TokensService, tick: number) {
    super();
    this.tick = tick;
  }

  async execute() {
    await this.checkTokensNow();
  }

  async getBasicTokens() {
    return this.erc721TokensService.getTokensForAddress(this.walletAddress);
  }

  async checkTokensNow() {
    const newBasicErc721Tokens = await this.getBasicTokens();
    if (!deepEqual(this.lastBasicErc721Tokens, newBasicErc721Tokens)) {
      this.lastBasicErc721Tokens = clonedeep(newBasicErc721Tokens);
      const newErc721Tokens = await this.erc721TokensService.getTokensDetails(newBasicErc721Tokens);
      this.callbacks.forEach(async (callback) => callback(newErc721Tokens));
    }
  }

  subscribe(callback: OnErc721TokensChange) {
    this.callbacks.push(callback);
    if (this.isStopped()) {
      this.start();
    }

    const unsubscribe = () => {
      this.callbacks = this.callbacks.filter((element) => callback !== element);
      if (this.callbacks.length === 0) {
        this.stop();
        this.lastBasicErc721Tokens = undefined;
      }
    };
    return unsubscribe;
  }
}
