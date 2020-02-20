import {MessageStatus} from '@unilogin/commons';
import {Execution} from '../../src';

export async function waitForSuccess(pendingExecution: Promise<Execution>): Promise<MessageStatus> {
  const execution = await pendingExecution;
  return execution.waitToBeSuccess();
}
