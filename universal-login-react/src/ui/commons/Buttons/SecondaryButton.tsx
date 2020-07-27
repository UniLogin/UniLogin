
import React from 'react';
import {isClassName} from '@unilogin/commons';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/button/secondaryButton.sass';
import '../../styles/themes/UniLogin/components/button/secondaryButtonThemeUniLogin.sass';

interface SecondaryButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const SecondaryButton = ({text, onClick, disabled, id, className}: SecondaryButtonProps) => (
  <button onClick={onClick} disabled={disabled} id={id} className={`${useClassFor('secondary-button')} ${isClassName(className)}`}>
    {text}
  </button>
);
