import {BlockNumberState} from '../states/BlockNumberState';
import {Callback} from 'reactive-properties/dist/Property';

export class BlockNumberService {
  constructor(
    private blockNumberState: BlockNumberState,
  ) {
  }

  get() {
    return this.blockNumberState.get();
  }

  set(blockNumber: number) {
    this.blockNumberState.set(blockNumber);
  }

  subscribe(callback: Callback) {
    return this.blockNumberState.subscribe(callback);
  }
}
