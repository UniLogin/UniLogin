import React from 'react';
import {useClassFor} from '../../utils/classFor';
import '../../styles/base/primaryButton.sass';
import '../../styles/themes/Legacy/primaryButtonThemeLegacy.sass';
import '../../styles/themes/Jarvis/primaryButtonThemeJarvis.sass';
import '../../styles/themes/UniLogin/primaryButtonThemeUniLogin.sass';

interface PrimaryButtonProps {
  title?: string;
  className?: string;
  onClick?: () => void;
}

export const PrimaryButton = ({title, className, onClick}: PrimaryButtonProps) => {
  const customClass = (className) || '';
  return (
    <button onClick={onClick} className={`${useClassFor('btn-primary')} ${customClass}`}>
      {title && <p>{title}</p>}
    </button>
  );
};
