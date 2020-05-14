import React, {ReactNode} from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/components/text/errorMessage.sass';
import './../styles/themes/Legacy/components/text/errorMessageThemeLegacy.sass';
import './../styles/themes/Jarvis/components/text/errorMessageThemeJarvis.sass';
import './../styles/themes/UniLogin/components/text/errorMessageThemeUniLogin.sass';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  children?: ReactNode;
}

export const ErrorMessage = ({title = 'Something went wrong', message = 'Please try again later.', children}: ErrorMessageProps) => (
  <div className={useClassFor('error-message')}>
    <h1 className={classForComponent('error-message-title')}>{title}</h1>
    <div className={classForComponent('error-message-content')}>
      <div className={classForComponent('error-message-section')}>
        <p className={classForComponent('error-message-text')}>{message}</p>
        {children}
      </div>
    </div>
  </div>
);
