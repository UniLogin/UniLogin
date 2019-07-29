import {useState, useEffect} from 'react';

export type Unsubscribe = () => void;

export interface Subscriber<T> {
  subscribe (callback: (event: T) => void): Unsubscribe;
}

export function useSubscription<T>(subscriber: Subscriber<T>) {
  const [event, setEvent] = useState<T | undefined>(undefined);
  useEffect(() => subscriber.subscribe(setEvent), []);
  return event;
}
