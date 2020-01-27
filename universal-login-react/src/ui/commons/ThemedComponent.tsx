import React, {ReactNode} from 'react';
import {useClassFor} from '../utils/classFor';

export interface ThemedComponentProps {
  name: string;
  children?: ReactNode;
  className?: string;
}

export const ThemedComponent = ({name, children, className}: ThemedComponentProps) => {
  const themedClass = useClassFor(name);

  return (
    <div className={[themedClass, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
};
