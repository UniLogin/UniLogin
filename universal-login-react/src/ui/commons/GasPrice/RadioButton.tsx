import React, {ReactNode} from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  children: ReactNode;
}

export const RadioButton = ({id, name, checked, disabled = false, onChange, children}: RadioButtonProps) => (
  <label className="gas-price-label">
    <input disabled={disabled} id={id} checked={checked} onChange={onChange} type="radio" name={name} className="gas-price-radio" />
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);
