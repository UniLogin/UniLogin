import {ProviderService} from '@unilogin/commons';
import {ReferenceCountedState} from './ReferenceCountedState';

export class BlockNumberState extends ReferenceCountedState<number> {
  constructor(private readonly providerService: ProviderService) {
    super(0);
  }

  bindedSet = (v: number) => this.set(v);

  onFirstSubscribe() {
    this.providerService.on('block', this.bindedSet);
  }

  onLastUnsubscribe() {
    this.providerService.removeListener('block', this.bindedSet);
  }
};
