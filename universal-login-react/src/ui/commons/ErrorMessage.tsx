import React, {ReactNode} from 'react';
import './../styles/errorMessage.sass';
import './../styles/errorMessageDefault.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  children?: ReactNode;
  className?: string;
}

export const ErrorMessage = ({title = 'Something went wrong', message = 'Please try again later.', children, className}: ErrorMessageProps) => (
  <div className={getStyleForTopLevelComponent(className)}>
    <h1 className="error-message-title">{title}</h1>
    <div className="error-message-content">
      <div className="error-message-section">
        <p className="error-message-text">{message}</p>
        {children}
      </div>
    </div>
  </div>
);
