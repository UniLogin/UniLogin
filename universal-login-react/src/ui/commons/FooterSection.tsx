import React, {ReactNode} from 'react';
import './../styles/footerSection.sass';
import './../styles/footerSectionDefault.sass';
import {useClassFor} from '../utils/classFor';

export interface FooterSectionProps {
  children: ReactNode;
}

export const FooterSection = ({children}: FooterSectionProps) => (
  <div className={useClassFor('footer-section')}>{children}</div>
);
