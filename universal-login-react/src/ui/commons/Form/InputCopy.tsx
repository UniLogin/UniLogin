import React from 'react';
import {useClassFor} from '../../utils/classFor';
import {Input} from './Input';
import {CopyButton} from '../Buttons/CopyButton';
import '../../styles/base/components/form/inputCopy.sass';

export interface InputCopyProps extends React.HTMLProps<HTMLInputElement> {
  id: string;
}

export const InputCopy = (props: InputCopyProps) => (
  <div className={useClassFor('input-wrapper')}>
    <Input id={props.id} {...props}/>
    <CopyButton elementId={props.id}/>
  </div>
);
