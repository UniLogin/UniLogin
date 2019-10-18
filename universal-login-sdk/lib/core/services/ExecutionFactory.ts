import {MessageStatus, ensure, SignedMessage, stringifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import {RelayerApi} from '../../integration/http/RelayerApi';
import {retry} from '../utils/retry';
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
    tick?: number,
    timeout?: number
  ) {
    super(tick, timeout);
  }

  async createExecution(signedMessage: SignedMessage): Promise<Execution> {
    const result = await this.relayerApi.execute(stringifySignedMessageFields(signedMessage));
    ensureNotNull(result.status.messageHash, MissingMessageHash);
    const {messageHash, totalCollected, required} = result.status;
    const waitToBeSuccess = totalCollected >= required ? this.createWaitToBeSuccess(messageHash) : async () => result.status;
    const waitForTransactionHash = totalCollected >= required ? this.createWaitForTransactionHash(messageHash) : async () => result.status;
    return {
      messageStatus: result.status,
      waitToBeSuccess,
      waitForTransactionHash
    };
  }

  private isExecuted(messageStatus: MessageStatus) {
    return messageStatus.state === 'Error' || messageStatus.state === 'Success';
  }

  private hasTransactionHash(messageStatus: MessageStatus) {
    return ['Pending', 'Success', 'Error'].includes(messageStatus.state);
  }

  private createWaitForTransactionHash(messageHash: string) {
    return async () => {
      const getStatus = async () => this.relayerApi.getStatus(messageHash);
      const isNotPending = (messageStatus: MessageStatus) => !this.hasTransactionHash(messageStatus);
      return retry(getStatus, isNotPending, this.timeout, this.tick);
    };
  }

  private createWaitToBeSuccess(messageHash: string) {
    return async () => {
      const getStatus = async () => this.relayerApi.getStatus(messageHash);
      const isNotExecuted = (messageStatus: MessageStatus) => !this.isExecuted(messageStatus);
      const status = await retry(getStatus, isNotExecuted, this.timeout, this.tick);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }
}
