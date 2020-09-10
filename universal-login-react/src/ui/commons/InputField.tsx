import React from 'react';
import {isClassName} from '@unilogin/commons';
import {useClassFor} from '../..';
import {Label} from './Form/Label';
import Input from './Input';
import '../styles/base/inputField.sass';
import '../styles/themes/UniLogin/inputFieldThemeUniLogin.sass';
import '../styles/themes/Jarvis/inputFieldThemeJarvis.sass';
import {classForComponent} from '../utils/classFor';

interface InputFieldProps {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  label?: string;
  className?: string;
  id: string;
  description?: string;
  type?: string;
}

export const InputField = ({value, setValue, label, description, id, className, error, type}: InputFieldProps) => {
  const descriptionClassName = useClassFor('input-description');
  return (<div className={`${useClassFor('input-wrapper')} ${isClassName(className)}`}>
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
