import {useState, useCallback} from 'react';
import {debounce} from '@unilogin/commons';
import {Validator, validateWithEvery} from '../../app/validateWithEvery';

export const useInputField = (validators: Validator[]): [string, (value: string) => void, string | undefined] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const handleError = async (value: string) => {
    if (!value) {
      setError('');
    } else {
      const [isValid, error] = await validateWithEvery(validators, value);
      isValid ? setError('') : setError(error);
    }
  };
  const debouncedHandleError = useCallback(debounce(handleError, 500), []);

  const updateValue = (value: string) => {
    setValue(value);
    debouncedHandleError(value);
  };
  return [value, updateValue, error];
};
