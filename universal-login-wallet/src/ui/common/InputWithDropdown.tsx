import React from 'react';
import useToggler from '../../hooks/useToggler';

interface InputProps {
  onChange: (...args: any[]) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  id: string;
}


const InputWithDropdown = ({onChange, placeholder, autoFocus, id, className}: InputProps) => {
  const {visible, toggle} = useToggler();
  const onDropdownItemClick = () => {
    toggle();
  };
  const shortcuts = ['ETH', 'ETH', 'ETH'];

  return (
    <div className="input-dropdown-wrapper">
      <input
        id={id}
        className={`input input-dropdown ${className ? className : ''}`}
        onChange={onChange}
        type="number"
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
      <div className="currency-dropdown">
        <button onClick={toggle} className="currency-dropdown-btn">ETH</button>
        {visible ?
          <ul className="currency-dropdown-list">
            {shortcuts.map((currency, i) => (
              <li key={i} className="currency-item">
                <button className="currency-item-btn" onClick={onDropdownItemClick}>{currency}</button>
              </li>
            ))}
         </ul>
         : null
        }
      </div>
    </div>
  );
};

export default InputWithDropdown;
