import React, {useState, useEffect} from 'react';
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
    ? <SnackWaiting text={message} />
    : null);
};
