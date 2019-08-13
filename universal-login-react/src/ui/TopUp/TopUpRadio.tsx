import React, {ReactNode} from 'react';

export interface TopUpRadioProps {
  onClick: () => void;
  checked: boolean;
  className?: string;
  children: ReactNode;
  name: string;
  id?: string;
}

export const TopUpRadio = ({id, onClick, checked, children, className, name}: TopUpRadioProps) => (
  <label
    id={id}
    onClick={onClick}
    className={`top-up-radio-label ${className ? className : ''}`}
  >
    <input
      className="top-up-radio"
      type="radio"
      name={name}
      checked={checked}
      readOnly
    />
    <div className="top-up-radio-inner">
      {children}
    </div>
  </label>
);
