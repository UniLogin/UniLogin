import {MessageStatus, ensure, SignedMessage, stringifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import {RelayerApi} from '../RelayerApi';
import {retry} from '../utils/retry';
import {MissingMessageHash} from '../utils/errors';

export interface Execution {
  waitToBePending: () => Promise<MessageStatus>;
  waitToBeMined: () => Promise<MessageStatus>;
  messageStatus: MessageStatus;
}

export class ExecutionFactory {
  private timeout: number = 600000;
  private tick: number = 1000;

  constructor(private relayerApi: RelayerApi) {
  }

  async createExecution(signedMessage: SignedMessage): Promise<Execution> {
    const result = await this.relayerApi.execute(stringifySignedMessageFields(signedMessage));
    ensureNotNull(result.status.messageHash, MissingMessageHash);
    const {messageHash, totalCollected, required} = result.status;
    const waitToBeMined = totalCollected >= required ? this.createWaitToBeMined(messageHash) : async () => result.status;
    const waitToBePending = async () => {
      throw Error('Not implemented');
    };
    return {
      messageStatus: result.status,
      waitToBeMined,
      waitToBePending
    };
  }

  private isExecuted (messageStatus: MessageStatus){
    return !!messageStatus.transactionHash || !!messageStatus.error;
  }

  private createWaitToBeMined(messageHash: string){
    return async () => {
      const getStatus = () => this.relayerApi.getStatus(messageHash);
      const isNotExecuted = (messageStatus: MessageStatus) => !this.isExecuted(messageStatus);
      const status = await retry(getStatus, isNotExecuted, this.timeout, this.tick);
      ensure(!status.error, Error, status.error!);
      return status;
    };
  }
}
