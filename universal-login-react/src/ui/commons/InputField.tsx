import React, {useState} from 'react';
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

export const InputField = ({value, setValue, label, description, id, error}: InputFieldProps) => {
  const descriptionClassName = useClassFor('input-description');
  return (<>
    {label && <Label>{`${label}:`}</Label>}
    <Input
      className={` ${useClassFor('input')}`}
      id={id}
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
    {description && <p className={descriptionClassName}>{description}</p>}
    {error && <div>{error}</div>}
  </>);
};

export const useInputField = (validate: (value: string) => boolean, errorMessage: string): [string, (value: string) => void, string | undefined] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const updateValue = (value: string) => {
    setValue(value);
    if (validate(value) && error) {
      setError(undefined);
    } else if (!validate(value) && !error) {
      setError(errorMessage);
    }
  };
  return [value, updateValue, error];
};
