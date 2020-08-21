import {useState, useCallback} from 'react';
import {debounce} from '@unilogin/commons';
import {Validator, areValid} from '../../app/areValid';

export const useInputField = (validators: Validator[]): [string, (value: string) => void, string | undefined] => {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const handleError = async (value: string) => {
    if (!value) {
      setError('');
    } else {
      const [allValid, errors] = await areValid(validators, value);
      allValid ? setError('') : setError(errors[0]);
    }
  };
  const debouncedHandleError = useCallback(debounce(handleError, 500), []);

  const updateValue = (value: string) => {
    setValue(value);
    debouncedHandleError(value);
  };
  return [value, updateValue, error];
};
