import React, {ReactNode} from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/footerSection.sass';
import './../styles/footerSectionDefault.sass';

export interface FooterSectionProps {
  children: ReactNode;
  className?: string;
}

export const FooterSection = ({children, className}: FooterSectionProps) => {
  return (
    <div className="universal-login-footer">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="footer-section">{children}</div>
      </div>
    </div>
  );
};
