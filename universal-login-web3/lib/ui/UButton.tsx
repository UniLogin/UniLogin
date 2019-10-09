import React, {useEffect, useRef} from 'react';
import {ULWeb3Provider} from '../ULWeb3Provider';

export interface UButtonProps {
  provider: ULWeb3Provider;
}

export const UButton = ({provider}: UButtonProps) => {
  const ref = useRef<Element | null>(null);

  useEffect(() => {
    if (ref.current) {
      provider.initWeb3Button(ref.current);
    }
  }, [ref.current]);

  return (
    <div
      ref={(elem) => {
        ref.current = elem;
      }}
    />
  );
};
