import {useState, useEffect} from 'react';
import {EventEmitter} from 'fbemitter';
import {Subject} from '../services/Subject';

export function useEvent(emitter: EventEmitter, eventName: string) {
  const [event, setEvent] = useState(undefined as any);
  useEmitter(emitter, eventName, setEvent);
  return event;
}

export function useEmitter(
  emitter: EventEmitter,
  eventName: string,
  callback: (value: any) => void,
) {
  useEffect(() => {
    const subscription = emitter.addListener(eventName, callback);
    return () => {
      subscription.remove();
    };
  }, []);
}

export function useSubscription<T>(subject: Subject<T>) {
  const [event, setEvent] = useState<T | undefined>(undefined);
  useEffect(() => subject.subscribe(setEvent), []);
  return event;
}
