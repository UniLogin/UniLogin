import {MessageStatus} from '@unilogin/commons';
import {Execution} from '../../core/services/ExecutionFactory';

export class BackupCodesWithExecution {
  constructor(private execution: Execution, private codes: string[]) {
  }

  waitToBeSuccess = async (): Promise<string[]> => {
    await this.execution.waitToBeSuccess();
    return this.codes;
  };

  waitForTransactionHash = (): Promise<MessageStatus> => this.execution.waitForTransactionHash();
}
