import React, {ReactNode} from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const RadioButton = ({id, name, checked, disabled = false, onClick, children}: RadioButtonProps) => (
  <label className="gas-price-label">
    <input disabled={disabled} id={id} checked={checked} onClick={onClick} type="radio" name={name} className="gas-price-radio" readOnly/>
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);
