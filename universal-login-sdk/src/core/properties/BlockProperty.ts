import {BlockchainService} from '@universal-login/contracts';
import {ReferenceCountedProperty} from './ReferenceCountedProperty';

export class BlockProperty extends ReferenceCountedProperty<number> {
  constructor(private readonly blockchainService: BlockchainService) {
    super(0);
  }

  bindedSet = (v: number) => this.set(v);

  onFirstSubscribe() {
    this.blockchainService.on('block', this.bindedSet);
  }

  onLastUnsubscribe() {
    this.blockchainService.removeListener('block', this.bindedSet);
  }
};
