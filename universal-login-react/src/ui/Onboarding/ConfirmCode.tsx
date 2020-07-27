import React, {useState} from 'react'
import {ReactCodeInput} from './ReactCodeInput';
import {ensure, ensureNotFalsy} from '@unilogin/commons';

export interface ConfirmCodeProps {
}

const CODE_LENGTH = 6;

export const ConfirmCode = ({}: ConfirmCodeProps) => {
  const [code, setCode] = useState<string | undefined>(undefined);

  const onConfirmClick = () => {
    ensureNotFalsy(code, Error, 'Code is missing');
    ensure(code?.length === CODE_LENGTH, Error, 'Code is incomplete.');
  };

  return <>
    <ReactCodeInput
      name='code-input'
      inputMode='numeric'
      type='number'
      fields={6}
      value={code}
      onChange={setCode}
    />
    <button
      disabled={!(code?.length === CODE_LENGTH)}
      onClick={onConfirmClick}
    >
      Confirm
    </button>
  </>;
};
