import {MessageStatus, SignedMessage, stringifySignedMessageFields, ensureNotFalsy, MineableStatus} from '@unilogin/commons';
import {RelayerApi} from '../../integration/http/RelayerApi';
import {MissingMessageHash} from '../utils/errors';
import {MineableFactory} from './MineableFactory';

export interface Execution {
  waitForTransactionHash: () => Promise<MineableStatus>;
  waitToBeSuccess: () => Promise<MineableStatus>;
  messageStatus: MessageStatus;
}

export class ExecutionFactory extends MineableFactory {
  constructor(
    private relayerApi: RelayerApi,
    tick: number,
    timeout: number,
  ) {
    super(
      tick,
      timeout,
      (hash: string) => this.relayerApi.getStatus(hash),
    );
  }

  async createExecution(signedMessage: SignedMessage): Promise<Execution> {
    const result = await this.relayerApi.execute(stringifySignedMessageFields(signedMessage));
    ensureNotFalsy(result.status.messageHash, MissingMessageHash);
    const {messageHash} = result.status;
    return {
      messageStatus: result.status,
      waitToBeSuccess: this.createWaitToBeSuccess(messageHash),
      waitForTransactionHash: this.createWaitForTransactionHash(messageHash),
    };
  }
}
