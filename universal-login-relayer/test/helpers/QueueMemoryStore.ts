import {IExecutionQueue} from '../../src/core/models/execution/IExecutionQueue';
import {QueueItem} from '../../src/core/models/QueueItem';

export default class QueueMemoryStore implements IExecutionQueue {
  queueItems: QueueItem[] = [];

  async addMessage(messageHash: string) {
    this.queueItems.push({
      type: 'Message',
      hash: messageHash,
    });
    return messageHash;
  }

  async addDeployment(deploymentHash: string) {
    this.queueItems.push({
      type: 'Deployment',
      hash: deploymentHash,
    });
    return deploymentHash;
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
