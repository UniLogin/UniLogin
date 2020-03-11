import {State, Callback} from 'reactive-properties';

export abstract class ReferenceCountedState<T> extends State<T> {
  private subscribersCount = 0;

  abstract onFirstSubscribe(): void;

  abstract onLastUnsubscribe(): void;

  subscribe(callback: Callback): Callback {
    const unsubscribe = super.subscribe(callback);
    if (this.subscribersCount === 0) {
      this.onFirstSubscribe();
    }
    this.subscribersCount++;
    return () => {
      this.subscribersCount--;
      if (this.subscribersCount === 0) {
        this.onLastUnsubscribe();
      }
      unsubscribe();
    };
  }
}
