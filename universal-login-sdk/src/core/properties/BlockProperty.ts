import {Provider} from 'ethers/providers';
import {ReferenceCountedProperty} from './ReferenceCountedProperty';

export class BlockProperty extends ReferenceCountedProperty<number> {
  constructor(private readonly provider: Provider) {
    super(0);
  }

  bindedSet = (v: number) => this.set(v);

  onFirstSubscribe() {
    this.provider.on('block', this.bindedSet);
  }

  onLastUnsubscribe() {
    this.provider.removeListener('block', this.bindedSet);
  }
};
