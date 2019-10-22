import {MineableState, MineableStatus, ensureNotNull} from '@universal-login/commons';
import {TransactionHashNotFound} from '../utils/errors';

const DEFAULT_TIMEOUT = 600000;
const DEFAULT_TICK = 1000;

export class MineableFactory {
  constructor(
    protected tick: number = DEFAULT_TICK,
    protected timeout: number = DEFAULT_TIMEOUT
  ) {}

  protected isMined(state: MineableState) {
    return state === 'Error' || state === 'Success';
  }

  protected hasTransactionHash(status: MineableStatus) {
    return ['Pending', 'Success', 'Error'].includes(status.state) &&
      ensureNotNull(status.transactionHash, TransactionHashNotFound);
  }
}
