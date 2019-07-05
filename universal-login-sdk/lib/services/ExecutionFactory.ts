import {MessageStatus, ensure} from '@universal-login/commons';
import {RelayerApi} from '../RelayerApi';
import {retry} from '../utils/retry';

export interface Execution {
  waitForPending: () => Promise<MessageStatus>;
  waitForMined: () => Promise<MessageStatus>;
  messageStatus: MessageStatus;
}

export class ExecutionFactory {
  constructor(private relayerApi: RelayerApi) {

  }

  createExecution(messageHash: string): Execution {
    const waitForMined = this.createWaitForMined(messageHash);
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
