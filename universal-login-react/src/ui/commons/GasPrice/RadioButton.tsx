import React, {ReactNode} from 'react';

interface RadioButtonProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}

export const RadioButton = ({id, name, checked, onChange, children}: RadioButtonProps) => (
  <label className="gas-price-label">
    <input id={id} checked={checked} onChange={onChange} type="radio" name={name} className="gas-price-radio" />
    <div className="gas-price-radio-custom">
      {children}
    </div>
  </label>
);
