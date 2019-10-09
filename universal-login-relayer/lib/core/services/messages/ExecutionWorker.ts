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
    private tick: number = 100
  ) {
    this.state = 'stopped';
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

  async loop() {
    const tick = async () => {
      if (this.state === 'stopping'){
        this.state = 'stopped';
      } else {
        await sleep(this.tick);
      }
    };

    const tryExecute = async (nextMessage: QueueItem) => {
      if (this.messageExecutor.canExecute(nextMessage)){
        await this.execute(nextMessage.hash);
      } else {
        await this.executionQueue.remove(nextMessage.hash);
      }
    };

    do {
      const nextMessage = await this.executionQueue.getNext();
      if (nextMessage){
        await tryExecute(nextMessage);
      } else {
        await tick();
      }
    } while (this.state !== 'stopped');
  }

  async stop() {
    this.state = 'stopped';
  }

  async stopLater() {
    this.state = 'stopping';
    while (!this.isStopped()) {
      await sleep(this.tick);
    }
  }

  private isStopped() {
    return this.state === 'stopped';
  }
}

export default ExecutionWorker;
