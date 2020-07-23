import React from 'react';
import {useClassFor} from '../..';
import {Label} from './Form/Label';
import Input from './Input';
import '../styles/base/inputField.sass';
import '../styles/themes/UniLogin/inputFieldThemeUniLogin.sass';

interface InputFieldProps {
  value: string;
  setValue: (value: string) => void;
  error?: string;
  label?: string;
  id: string;
  description?: string;
}

export const InputField = ({value, setValue, label, description, id, error}: InputFieldProps) => <>
  {label && <Label>{`${label}:`}</Label>}
  <Input
    className={` ${useClassFor('input')}`}
    id={id}
    onChange={(event) => setValue(event.target.value)}
    value={value}
  />
  {description && <p className={useClassFor('input-description')}>We will use your email and password to help you recover your account. We do not hold custody of your funds. If you’d rather not share an email</p>}
  {error && <div>{error}</div>}
</>;
