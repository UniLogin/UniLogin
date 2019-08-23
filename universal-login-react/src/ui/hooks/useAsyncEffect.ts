import {useEffect} from 'react';

type Unsubscribe = () => void;

export const useAsyncEffect = (asyncCallback: () => Promise<Unsubscribe>, deps?: any[]) => {
  useEffect(() => {
    const promise = asyncCallback();
    return () => {
      promise.then((unsubscribe: Unsubscribe) => unsubscribe(), e => console.error(e));
    };
  }, deps);
};
