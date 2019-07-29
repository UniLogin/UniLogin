import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPanelProps {
  code: number[];
  className?: string;
}

export const EmojiPanel = ({code, className}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li style={{margin: '10px'}} key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="universal-login-emoji">
        <ul>
          {emojis}
        </ul>
      </div>
    </div>
  );
};
