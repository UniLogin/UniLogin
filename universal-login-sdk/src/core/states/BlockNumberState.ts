import {BlockchainService} from '@universal-login/contracts';
import {ReferenceCountedState} from './ReferenceCountedState';

export class BlockNumberState extends ReferenceCountedState<number> {
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
