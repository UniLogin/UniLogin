import React from 'react';
import {useClassFor} from '../..';
import {Label} from './Form/Label';
import Input from './Input';
import '../styles/base/inputField.sass';
import '../styles/themes/UniLogin/inputFieldThemeUniLogin.sass';
import {classForComponent} from '../utils/classFor';

interface InputFieldProps {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  label?: string;
  id: string;
  description?: string;
  type?: string;
}

export const InputField = ({value, setValue, label, description, id, error, type}: InputFieldProps) => {
  const descriptionClassName = useClassFor('input-description');
  return (<div className={`${useClassFor('input-wrapper')}`}>
    {label && <Label>{`${label}:`}</Label>}
    <Input
      type={type || 'text'}
      id={id}
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
    {description && <p className={descriptionClassName}>{description}</p>}
    {error && <p className={`${classForComponent('input-error-hint')}`}>{error}</p>}
  </div>);
};
