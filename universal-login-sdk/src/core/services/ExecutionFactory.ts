import {MessageStatus, SignedMessage, stringifySignedMessageFields, ensureNotFalsy} from '@unilogin/commons';
import {RelayerApi} from '../../integration/http/RelayerApi';
import {MissingMessageHash} from '../utils/errors';
import {MineableFactory} from './MineableFactory';

export interface Execution {
  waitForTransactionHash: () => Promise<MessageStatus>;
  waitToBeSuccess: () => Promise<MessageStatus>;
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
    const {messageHash, totalCollected, required} = result.status;
    const waitToBeSuccess = totalCollected >= required ? this.createWaitToBeSuccess(messageHash) : async () => result.status;
    const waitForTransactionHash = totalCollected >= required ? this.createWaitForTransactionHash(messageHash) : async () => result.status;
    return {
      messageStatus: result.status,
      waitToBeSuccess,
      waitForTransactionHash,
    };
  }
}
