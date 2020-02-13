import React from 'react';
import {isClassName} from '@universal-login/commons';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/button/closeButton.sass';
import '../../styles/themes/Jarvis/components/button/closeButtonThemeJarvis.sass';
import '../../styles/themes/Legacy/components/button/closeButtonThemeLegacy.sass';
import '../../styles/themes/Default/components/button/closeButtonThemeDefault.sass';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const CloseButton = ({onClick, className}: CloseButtonProps) => (
  <button onClick={onClick} className={`${useClassFor('close-button')} ${isClassName(className)}`} />
);
