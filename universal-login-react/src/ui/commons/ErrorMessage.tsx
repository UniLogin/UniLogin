import React, {ReactNode} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {useClassFor, classForComponent} from '../utils/classFor';
import './../styles/base/components/text/errorMessage.sass';
import './../styles/themes/Legacy/components/text/errorMessageThemeLegacy.sass';
import './../styles/themes/Jarvis/components/text/errorMessageThemeJarvis.sass';
import './../styles/themes/UniLogin/components/text/errorMessageThemeUniLogin.sass';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
}

export const ErrorMessage = ({title = 'Something went wrong', message = 'Please try again later.', children, className}: ErrorMessageProps) => (
  <div className={useClassFor('error-message')}>
    <div className={getStyleForTopLevelComponent(className)}>
      <h1 className={classForComponent('error-message-title')}>{title}</h1>
      <div className={classForComponent('error-message-content')}>
        <div className={classForComponent('error-message-section')}>
          <p className={classForComponent('error-message-text')}>{message}</p>
          {children}
        </div>
      </div>
    </div>
  </div>
);
