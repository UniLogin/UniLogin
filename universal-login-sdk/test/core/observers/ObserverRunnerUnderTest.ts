import ObserverRunner from '../../../src/core/observers/ObserverRunner';
import {sleep} from '@unilogin/commons';

export class ObserverRunnerUnderTest extends ObserverRunner {
  iterator = 0;

  constructor(tick: number) {
    super();
    this.tick = tick;
  }

  async execute() {
    this.iterator++;
    await sleep(this.tick);
    this.iterator++;
  }
}
