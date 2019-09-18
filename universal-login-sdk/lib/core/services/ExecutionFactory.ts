import {MessageStatus, ensure, SignedMessage, stringifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import {RelayerApi} from '../../integration/http/RelayerApi';
import {retry} from '../utils/retry';
import {MissingMessageHash} from '../utils/errors';

const DEFAULT_EXECUTION_TIMEOUT = 600000;
const DEFAULT_EXECUTION_TICK = 1000;

export interface Execution {
  waitToExecutionStart: () => Promise<MessageStatus>;
  waitToBeMined: () => Promise<MessageStatus>;
  messageStatus: MessageStatus;
}

export class ExecutionFactory {
  constructor(
    private relayerApi: RelayerApi,
    private tick: number = DEFAULT_EXECUTION_TICK,
    private timeout: number = DEFAULT_EXECUTION_TIMEOUT
  ) {}

  async createExecution(signedMessage: SignedMessage): Promise<Execution> {
    const result = await this.relayerApi.execute(stringifySignedMessageFields(signedMessage));
    ensureNotNull(result.status.messageHash, MissingMessageHash);
    const {messageHash, totalCollected, required} = result.status;
    const waitToBeMined = totalCollected >= required ? this.createWaitToBeMined(messageHash) : async () => result.status;
    const waitToExecutionStart = totalCollected >= required ? this.createExecutionStart(messageHash) : async () => result.status;
    return {
      messageStatus: result.status,
      waitToBeMined,
      waitToExecutionStart
    };
  }

  private isExecuted(messageStatus: MessageStatus) {
    return messageStatus.state === 'Error' || messageStatus.state === 'Success';
  }

  private isStarted(messageStatus: MessageStatus) {
    return ['Pending', 'Success', 'Error'].includes(messageStatus.state);
  }

  private createGetStatus(messageHash: string) {
    return async () => this.relayerApi.getStatus(messageHash);
  }

  private createExecutionStart(messageHash: string) {
    return async () => {
      const isNotPending = (messageStatus: MessageStatus) => !this.isStarted(messageStatus);
      const status = await retry(this.createGetStatus(messageHash), isNotPending, this.timeout, this.tick);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }

  private createWaitToBeMined(messageHash: string) {
    return async () => {
      const getStatus = this.createGetStatus(messageHash);
      const isNotExecuted = (messageStatus: MessageStatus) => !this.isExecuted(messageStatus);
      const status = await retry(getStatus, isNotExecuted, this.timeout, this.tick);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }
}
