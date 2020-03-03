import {MineableStatus} from '@unilogin/commons';
import {Execution} from '../../src';

export async function waitForSuccess(pendingExecution: Promise<Execution>): Promise<MineableStatus> {
  const execution = await pendingExecution;
  return execution.waitToBeSuccess();
}
