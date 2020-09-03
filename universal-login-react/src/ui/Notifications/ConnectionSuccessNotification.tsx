import React from 'react';
import '../styles/base/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import {useHistory} from 'react-router';
import {ThemedComponent} from '../commons/ThemedComponent';

interface ConnectionSuccessNotificationProps {
  basePath: string;
}

export const ConnectionSuccessNotification = ({basePath}: ConnectionSuccessNotificationProps) => {
  const history = useHistory();

  return (
    <ThemedComponent id="notifications" name="emoji">
      <div className="emoji-success">
        <p className="emoji-success-text">You successfully authorized a new device.</p>
        <button className="emoji-success-button" onClick={() => history.replace(basePath)}>Go to devices</button>
      </div>
    </ThemedComponent>
  );
};
