import {IExecutionQueue} from '../../src/core/models/execution/IExecutionQueue';
import {QueueItem} from '../../src/core/models/QueueItem';
import Deployment from '../../src/core/models/Deployment';

export default class QueueMemoryStore implements IExecutionQueue {
  queueItems: QueueItem[] = [];

  async addMessage(hash: string) {
    this.queueItems.push({
      type: 'Message',
      hash,
    });
    return hash;
  }

  async addDeployment(deployment: Deployment) {
    this.queueItems.push({
      type: 'Deployment',
      hash: deployment.hash,
    });
    return deployment.hash;
  }

  async getNext() {
    return this.queueItems[0];
  }

  async remove(hash: string) {
    this.queueItems.splice(this.findIndex(hash), 1);
  }

  private findIndex(hash: string) {
    return this.queueItems.findIndex((messageEntity: QueueItem) => messageEntity.hash === hash);
  }
}
