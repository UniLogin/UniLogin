import React from 'react';
import '../styles/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import {useHistory} from 'react-router';
import {ThemedComponent} from '../commons/ThemedComponent';

interface ConnectionSuccessNotificationProps {
  basePath: string;
  className?: string;
}

export const ConnectionSuccessNotification = ({basePath, className}: ConnectionSuccessNotificationProps) => {
  const history = useHistory();

  return (
    <ThemedComponent id="notifications" name="emoji" className={className}>
      <div className="emoji-success">
        <p className="emoji-success-text">You successfully authorized a new device.</p>
        <button className="emoji-success-button" onClick={() => history.replace(basePath)}>Go to devices</button>
      </div>
    </ThemedComponent>
  );
};
