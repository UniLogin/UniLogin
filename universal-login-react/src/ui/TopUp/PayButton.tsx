import React from 'react';

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
      className="pay-btn"
      disabled={state === 'disabled'}
    >
      Pay
    </button>
  );
};
