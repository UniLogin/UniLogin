import React from 'react';
import {classForComponent} from '../../utils/classFor';
import '../../styles/base/components/form/label.sass';

export interface LabelProps {
  children: string;
  htmlFor?: string;
}

export const Label = ({children, htmlFor}: LabelProps) => (
  <label className={classForComponent('label')} htmlFor={htmlFor}>{children}</label>
);
