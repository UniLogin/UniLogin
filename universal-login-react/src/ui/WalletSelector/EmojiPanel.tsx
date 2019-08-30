import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';

interface EmojiPanelProps {
  code: number[];
  className?: string;
}

export const EmojiPanel = ({code, className}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li className="emoji-item" key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <ul className="emoji-panel-list">
          {emojis}
        </ul>
      </div>
    </div>
  );
};
