import {useEffect, RefObject} from 'react';

export const useOutsideClick = (ref: RefObject<HTMLDivElement>, callback: () => void, deps?: any[]) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLInputElement)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, deps);
};
