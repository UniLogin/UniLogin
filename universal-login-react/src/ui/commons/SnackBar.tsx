import React, {useState, useEffect} from 'react';

export interface SnackBarProps {
  delay: number;
  component: React.ReactNode;
};

export const SnackBar = ({delay, component}: SnackBarProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout_id = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timeout_id);
  }, []);

  return (visible ? component : null);
};