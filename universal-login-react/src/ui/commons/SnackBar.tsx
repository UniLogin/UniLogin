import React, {useState, useEffect} from 'react';
import {CloseButton} from './Buttons/CloseButton';
import {SnackWaiting} from './SnackWaiting';

export interface SnackBarProps {
  delay: number;
  message: string;
};

export const SnackBar = ({delay, message}: SnackBarProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout_id = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timeout_id);
  }, []);

  return (visible
    ? <div>
      <SnackWaiting text={message}/>
      <CloseButton onClick={() => setVisible(false)} />
    </div>
    : null);
};
