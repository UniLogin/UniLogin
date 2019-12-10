import {MineableState, MineableStatus, ensureNotNull, ensure} from '@universal-login/commons';
import {TransactionHashNotFound} from '../utils/errors';
import {retry} from '../utils/retry';

// const DEFAULT_TIMEOUT = ;
// const DEFAULT_TICK = ;

export class MineableFactory {
  constructor(
    protected tick: number,
    protected timeout: number,
    protected getStatus: (hash: string) => Promise<any>,
  ) {}

  protected isMined(state: MineableState) {
    return state === 'Error' || state === 'Success';
  }

  protected hasTransactionHash(status: MineableStatus) {
    if (['Pending', 'Success'].includes(status.state)) {
      ensureNotNull(status.transactionHash, TransactionHashNotFound);
    }
    return ['Pending', 'Success', 'Error'].includes(status.state);
  }

  protected createWaitForTransactionHash(hash: string) {
    return async () => {
      const predicate = (status: MineableStatus) => !this.hasTransactionHash(status);
      return this.waitForStatus(hash, predicate);
    };
  }

  protected createWaitToBeSuccess(hash: string) {
    return async () => {
      const predicate = (status: MineableStatus) => !this.isMined(status.state);
      const status = await this.waitForStatus(hash, predicate);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }

  private async waitForStatus(hash: string, predicate: (status: MineableStatus) => boolean): Promise<MineableStatus> {
    const getStatus = async () => this.getStatus(hash);
    return retry(getStatus, predicate, this.timeout, this.tick);
  }
}
