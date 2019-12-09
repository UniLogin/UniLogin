import {MessageStatus} from '@universal-login/commons';
import {Execution} from '../../core/services/ExecutionFactory';

export class BackupCodesWithExecution {
  constructor(private execution: Execution, private codes: string[]) {
  }

  async waitToBeSuccess(): Promise<string[]> {
    await this.execution.waitToBeSuccess();
    return this.codes;
  }

  async waitForTransactionHash(): Promise<MessageStatus> {
    return this.execution.waitForTransactionHash();
  }
}
