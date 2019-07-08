import {MessageStatus, ensure, SignedMessage, stringifySignedMessageFields, ensureNotNull} from '@universal-login/commons';
import {RelayerApi} from '../RelayerApi';
import {retry} from '../utils/retry';
import {MissingMessageHash} from '../utils/errors';

export interface Execution {
  waitForPending: () => Promise<MessageStatus>;
  waitForMined: () => Promise<MessageStatus>;
  messageStatus: MessageStatus;
}

export class ExecutionFactory {
  constructor(private relayerApi: RelayerApi) {

  }

  async createExecution(signedMessage: SignedMessage): Promise<Execution> {
    const result = await this.relayerApi.execute(stringifySignedMessageFields(signedMessage));
    ensureNotNull(result.status.messageHash, MissingMessageHash);
    const {messageHash, totalCollected, required} = result.status;
    const waitForMined = totalCollected >= required ? this.createWaitForMined(messageHash) : async () => result.status;
    const waitForPending = async () => {
      return {} as MessageStatus;
    };
    return {
      messageStatus: {} as MessageStatus,
      waitForMined,
      waitForPending
    };
  }

  private isExecuted (messageStatus: MessageStatus){
    return !!messageStatus.transactionHash || !!messageStatus.error;
  }

  private createWaitForMined(messageHash: string){
    return async () => {
      const getStatus = () => this.relayerApi.getStatus(messageHash);
      const isNotExecuted = (messageStatus: MessageStatus) => !this.isExecuted(messageStatus);
      const status = await retry(getStatus, isNotExecuted);
      ensure(!status.error, Error, status.error);
      return status;
    };
  }
}
