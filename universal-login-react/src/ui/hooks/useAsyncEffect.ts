import {useEffect} from 'react';

type Unsubscribe = () => void | undefined;

export const useAsyncEffect = (asyncCallback: () => Promise<Unsubscribe | void | undefined>, deps?: any[]) => {
  useEffect(() => {
    const promise = asyncCallback();
    return () => {
      promise.then((unsubscribe) => unsubscribe && unsubscribe(), e => console.error(e));
    };
  }, deps);
};
