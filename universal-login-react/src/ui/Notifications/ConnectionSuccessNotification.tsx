import React from 'react';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';

interface ConnectionSuccessNotificationProps {
  className?: string;
  onClose?: () => void;
}

export const ConnectionSuccessNotification = ({className, onClose}: ConnectionSuccessNotificationProps) => {
  return (
    <div id="notifications" className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="emoji-success">
          <p className="emoji-success-text">You successfully authorized a new device.</p>
          <button className="emoji-success-button" onClick={onClose}>Go to devices</button>
        </div>
      </div>
    </div>
  );
};
