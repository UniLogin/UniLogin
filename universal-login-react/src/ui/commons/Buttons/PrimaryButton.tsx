import React from 'react';
import {isClassName} from '@unilogin/commons';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/button/primaryButton.sass';
import '../../styles/themes/UniLogin/components/button/primaryButtonThemeUniLogin.sass';

interface PrimaryButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const PrimaryButton = ({text, onClick, disabled, id, className}: PrimaryButtonProps) => (
  <button onClick={onClick} disabled={disabled} id={id} className={`${useClassFor('primary-button')} ${isClassName(className)}`}>
    {text}
  </button>
);
