import React from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';
import {useHistory} from 'react-router';

interface ConnectionSuccessNotificationProps {
  className?: string;
}

export const ConnectionSuccessNotification = ({className}: ConnectionSuccessNotificationProps) => {
  const history = useHistory();

  return (
    <div id="notifications" className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="emoji-success">
          <p className="emoji-success-text">You successfully authorized a new device.</p>
          <button className="emoji-success-button" onClick={() => history.goBack()}>Go to devices</button>
        </div>
      </div>
    </div>
  );
};
