import {useEffect, RefObject} from 'react';

export const useOutsideClick = (ref: RefObject<HTMLDivElement>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLInputElement)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
