import {sleep, onCritical} from '@universal-login/commons';
import {IExecutionQueue} from './IExecutionQueue';
import MessageExecutor from '../../../integration/ethereum/MessageExecutor';
import {QueueItem} from '../../models/QueueItem';

type ExecutionWorkerState = 'running' | 'stopped' | 'stopping';

class ExecutionWorker {
  private state: ExecutionWorkerState;

  constructor(
    private messageExecutor: MessageExecutor,
    private executionQueue: IExecutionQueue,
    private tickInterval: number = 100
  ) {
    this.state = 'stopped';
  }

  async tryExecute(nextMessage: QueueItem) {
    if (this.messageExecutor.canExecute(nextMessage)){
      await this.execute(nextMessage.hash);
    } else {
      await this.executionQueue.remove(nextMessage.hash);
    }
  }

  async execute(messageHash: string) {
    await this.messageExecutor.handleExecute(messageHash);
    await this.executionQueue.remove(messageHash);
  }

  start() {
    if (this.state !== 'running') {
      this.state = 'running';
      this.loop().catch(onCritical);
    }
  }

  async tick() {
    if (this.state === 'stopping'){
      this.state = 'stopped';
    } else {
      await sleep(this.tickInterval);
    }
  }

  async loop() {
    do {
      const nextMessage = await this.executionQueue.getNext();
      if (nextMessage){
        await this.tryExecute(nextMessage);
      } else {
        await this.tick();
      }
    } while (this.state !== 'stopped');
  }

  async stop() {
    this.state = 'stopped';
  }

  async stopLater() {
    this.state = 'stopping';
    while (!this.isStopped()) {
      await sleep(this.tickInterval);
    }
  }

  private isStopped() {
    return this.state === 'stopped';
  }
}

export default ExecutionWorker;
