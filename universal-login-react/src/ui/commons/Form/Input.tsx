import React from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/form/input.sass';
import '../../styles/themes/UniLogin/components/form/inputThemeUniLogin.sass';

export const Input = (props: React.HTMLProps<HTMLInputElement>) => (
  <input className={useClassFor('input')} type={props.type || 'text'} {...props}/>
);
