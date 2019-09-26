import {SignedMessage, calculateMessageHash} from '@universal-login/commons';
import {IExecutionQueue} from '../../lib/core/services/messages/IExecutionQueue';
import {QueueItem} from '../../lib/core/models/QueueItem';
import Deployment from '../../lib/core/models/Deployment';

export default class QueueMemoryStore implements IExecutionQueue {
  public queueItems: QueueItem[];

  constructor() {
    this.queueItems = [];
  }

  async addMessage(signedMessage: SignedMessage) {
    const hash = calculateMessageHash(signedMessage);
    this.queueItems.push({
      type: 'Message',
      hash
    });
    return hash;
  }

  async addDeployment(deployment: Deployment) {
    this.queueItems.push({
      type: 'Deployment',
      hash: deployment.hash
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
