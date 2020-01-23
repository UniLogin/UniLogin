import React from 'react';
import {classForComponent} from '../utils/classFor';

export type ButtonState = 'active' | 'hidden' | 'disabled';

export interface PayButtonProps {
  onClick: () => void;
  state: ButtonState;
}

export const PayButton = ({onClick, state}: PayButtonProps) => {
  if (state === 'hidden') {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={classForComponent('pay-btn')}
      disabled={state === 'disabled'}
    >
      Pay
    </button>
  );
};
