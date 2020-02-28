import React, {ReactNode} from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/text/infoText.sass';
import '../../styles/themes/UniLogin/components/text/infoTextThemeUniLogin.sass';

export interface InfoTextProps {
  children: ReactNode;
}

export const InfoText = ({children}: InfoTextProps) => (
  <p className={useClassFor('info-text')}>{children}</p>
);
