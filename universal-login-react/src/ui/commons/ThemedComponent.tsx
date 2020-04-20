import React, {ReactNode} from 'react';
import {useClassFor} from '../utils/classFor';

export interface ThemedComponentProps {
  name: string;
  children?: ReactNode;
  className?: string;
  id?: string;
}

export const ThemedComponent = ({name, children, className, id}: ThemedComponentProps) => {
  const themedClass = useClassFor(name);

  return (
    <div
      id={id || ''}
      className={[themedClass, className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
};
