import React from 'react';
import {useClassFor} from '../utils/classFor';
import '../styles/base/payButton.sass';
import '../styles/themes/UniLogin/payButtonThemeUniLogin.sass';

export type ButtonState = 'active' | 'hidden' | 'disabled';

export interface PayButtonProps {
  onClick: () => void;
  state: ButtonState;
}

export const PayButton = ({onClick, state}: PayButtonProps) => {
  const buttonClass = useClassFor('pay-btn');
  if (state === 'hidden') {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      disabled={state === 'disabled'}
    >
      Pay
    </button>
  );
};
