import React, {useState, useCallback} from 'react';
import {useClassFor} from '../..';
import {Label} from './Form/Label';
import Input from './Input';
import '../styles/base/inputField.sass';
import '../styles/themes/UniLogin/inputFieldThemeUniLogin.sass';
import {debounce} from '@unilogin/commons';
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
      className={` ${useClassFor('input')}`}
      id={id}
      onChange={(event) => setValue(event.target.value)}
      value={value}
    />
    {description && <p className={descriptionClassName}>{description}</p>}
    {error && <p className={`${classForComponent('input-error-hint')}`}>{error}</p>}
  </div>);
};

export const useInputField = (validate: (value: string) => boolean, errorMessage: string): [string, (value: string) => void, string | undefined] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const handleError = (value: string) => {
    const isValid = validate(value);
    if (value === '' || isValid) {
      setError('');
    } else if (!isValid) {
      setError(errorMessage);
    }
  };
  const debouncedHandleError = useCallback(debounce(handleError, 500), []);

  const updateValue = (value: string) => {
    setValue(value);
    debouncedHandleError(value);
  };
  return [value, updateValue, error];
};
