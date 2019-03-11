import React from 'react';

interface ButtonProps {
  onClick: () => void;
  id: string;
  children: string;
  className?: string;
  disabled?: boolean;
}

const ButtonFullwidth = ({onClick, children, id, className, disabled}: ButtonProps) => (
  <button
    id={id}
    onClick={onClick}
    className={`btn btn-primary btn-fullwidth ${className ? className : ''}`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default ButtonFullwidth;
