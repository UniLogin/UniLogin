import {useState, useEffect} from 'react';
import {Subscriber} from '../react/common/Subscriber';

export function useSubscription<T>(subscriber: Subscriber<T>) {
  const [event, setEvent] = useState<T | undefined>(undefined);
  useEffect(() => subscriber.subscribe(setEvent), []);
  return event;
}
