import {useEffect, DependencyList} from 'react';

type Unsubscribe = () => void;

export const useAsyncEffect = (asyncCallback: () => Promise<Unsubscribe>, deps?: DependencyList) => {
  useEffect(() => {
    const promise = asyncCallback();
    return () => {
      promise.then((unsubscribe: Unsubscribe) => unsubscribe(), e => console.error(e));
    };
  }, deps);
};
