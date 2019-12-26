import {State} from 'reactive-properties';
import {Callback} from 'reactive-properties/dist/Property';

export abstract class ReferenceCountedProperty<T> extends State<T> {
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
