import React, {ReactNode} from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/text/infoText.sass';
import '../../styles/themes/Default/components/text/infoTextThemeDefault.sass';
import '../../styles/themes/Jarvis/components/text/infoTextThemeJarvis.sass';
import '../../styles/themes/Legacy/components/text/infoTextThemeLegacy.sass';

export interface InfoTextProps {
  children: ReactNode;
}

export const InfoText = ({children}: InfoTextProps) => (
  <p className={useClassFor('info-text')}>{children}</p>
);
