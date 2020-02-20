import React from 'react';
import {copy} from '@unilogin/commons';
import {useClassFor, classForComponent} from '../../utils/classFor';
import './../../styles/base/components/button/copyButton.sass';
import './../../styles/themes/UniLogin/components/button/copyButtonThemeUniLogin.sass';
import './../../styles/themes/Jarvis/components/button/copyButtonThemeJarvis.sass';
import './../../styles/themes/Legacy/components/button/copyButtonThemeLegacy.sass';

export interface CopyButtonProps {
  elementId: string;
}

export const CopyButton = ({elementId}: CopyButtonProps) => (
  <button className={useClassFor('copy-button')} onClick={() => copy(elementId)}>
    <p className={classForComponent('copy-feedback')}>Copied</p>
  </button>
);
