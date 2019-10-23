import {MineableState, MineableStatus, ensureNotNull, ensure} from '@universal-login/commons';
import {TransactionHashNotFound} from '../utils/errors';
import {retry} from '../utils/retry';

const DEFAULT_TIMEOUT = 600000;
const DEFAULT_TICK = 1000;

export class MineableFactory {
  constructor(
    protected tick: number = DEFAULT_TICK,
    protected timeout: number = DEFAULT_TIMEOUT,
    protected getStatus: (hash: string) => Promise<any>
  ) {}

  protected isMined(state: MineableState) {
    return state === 'Error' || state === 'Success';
  }

  protected hasTransactionHash(status: MineableStatus) {
    if (['Pending', 'Success', 'Error'].includes(status.state)) {
      ensureNotNull(status.transactionHash, TransactionHashNotFound);
      return true;
    }
    return false;
  }

  protected createWaitForTransactionHash(hash: string) {
    return async () => {
      const predicate = (status: MineableStatus) => !this.hasTransactionHash(status);
      const status: MineableStatus = await this.waitForStatus(hash, predicate);
      return status;
    };
  }

  protected createWaitToBeSuccess(hash: string) {
    return async () => {
      const predicate = (status: MineableStatus) => !this.isMined(status.state);
      const status: MineableStatus = await this.waitForStatus(hash, predicate);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }

  private async waitForStatus(hash: string, predicate: (status: MineableStatus) => boolean) : Promise<MineableStatus> {
    const getStatus = async () => this.getStatus(hash);
    const status: MineableStatus = await retry(getStatus, predicate, this.timeout, this.tick);
    return status;
  }
}
