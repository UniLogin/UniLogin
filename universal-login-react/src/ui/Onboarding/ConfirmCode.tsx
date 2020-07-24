import React, {useState} from 'react';

export interface ConfirmCodeProps {
  onConfirm: (code: string) => void;
  onBack: () => void;
}

export const ConfirmCode = ({onConfirm, onBack}: ConfirmCodeProps) => {
  const [code, setCode] = useState('');

  return (<div>

  </div>);
};
