import React from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/form/input.sass';
import '../../styles/themes/Default/components/form/inputDefault.sass';
import '../../styles/themes/Jarvis/components/form/inputJarvis.sass';
import '../../styles/themes/Legacy/components/form/inputLegacy.sass';

export const Input = (props: React.HTMLProps<HTMLInputElement>) => (
  <input className={useClassFor('input')} type={props.type || 'text'} {...props}/>
);
