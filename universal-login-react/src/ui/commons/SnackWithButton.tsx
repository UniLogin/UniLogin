import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/themes/UniLogin/components/snackWithButtonThemeUniLogin.sass';

interface SnackWithButtonProps {
  text: string;
  buttonText: string;
  onClick: () => void;
}

export const SnackWithButton = ({text, buttonText, onClick}: SnackWithButtonProps) => (
  <div className={useClassFor('snack-with-button')}>
    <p className={classForComponent('snack-text')}>{text}</p>
    <button onClick={onClick} className={classForComponent('snack-button')}>{buttonText}</button>
  </div>
);
