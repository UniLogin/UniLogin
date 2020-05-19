import React, {ReactNode} from 'react';
import './../styles/base/footerSection.sass';
import './../styles/themes/Legacy/footerThemeLegacy.sass';
import './../styles/themes/UniLogin/footerThemeUniLogin.sass';
import {ThemedComponent} from './ThemedComponent';

export interface FooterSectionProps {
  children: ReactNode;
}

export const FooterSection = ({children}: FooterSectionProps) => (
  <ThemedComponent name="footer-section">{children}</ThemedComponent>
);
