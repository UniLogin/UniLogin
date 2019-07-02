import {useState, useEffect} from 'react';
import {Subject} from '../react/common/Subject';

export function useSubscription<T>(subject: Subject<T>) {
  const [event, setEvent] = useState<T | undefined>(undefined);
  useEffect(() => subject.subscribe(setEvent), []);
  return event;
}
