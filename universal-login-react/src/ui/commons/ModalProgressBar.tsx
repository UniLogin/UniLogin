import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/modalProgressBar.sass';
import '../styles/themes/UniLogin/modalProgressBarThemeUniLogin.sass';

export const ModalProgressBar = () => {
  return (
    <div className={useClassFor('modal-progress-bar')}>
      <div className={classForComponent('modal-progress-bar-current')}></div>
    </div>
  );
};
