import React from 'react';
import {useClassFor} from '../utils/classFor';

export const Hint = ({text}: {text: string}) => {
  return <div className={useClassFor('info-text-hint')}>{text}</div>;
};
