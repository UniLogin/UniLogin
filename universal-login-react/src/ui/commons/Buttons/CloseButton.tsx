import React from 'react';
import {isClassName} from '@unilogin/commons';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/components/button/closeButton.sass';
import '../../styles/themes/Jarvis/components/button/closeButtonThemeJarvis.sass';
import '../../styles/themes/Legacy/components/button/closeButtonThemeLegacy.sass';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export const CloseButton = ({onClick, className}: CloseButtonProps) => (
  <button onClick={onClick} className={`${useClassFor('close-button')} ${isClassName(className)}`} />
);
