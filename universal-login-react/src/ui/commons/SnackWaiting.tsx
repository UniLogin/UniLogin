import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/themes/UniLogin/components/snackWaitingThemeUniLogin.sass';

interface SnackWaitingProps {
  text: string;
}

export const SnackWaiting = ({text}: SnackWaitingProps) => (
  <div className={useClassFor('snack-waiting')}>
    <p className={classForComponent('snack-text')}>{text}</p>
    <div className={classForComponent('snack-progress-bar')}></div>
  </div>
);
