import {ContractService} from '@unilogin/contracts';
import {ReferenceCountedState} from './ReferenceCountedState';

export class BlockNumberState extends ReferenceCountedState<number> {
  constructor(private readonly contractService: ContractService) {
    super(0);
  }

  bindedSet = (v: number) => this.set(v);

  onFirstSubscribe() {
    this.contractService.on('block', this.bindedSet);
  }

  onLastUnsubscribe() {
    this.contractService.removeListener('block', this.bindedSet);
  }
};
