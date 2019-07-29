import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleClass} from '../../core/utils/getStyleClass';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPanelProps {
  code: number[];
  className?: string;
}

export const EmojiPanel = ({code, className}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div className={'universal-login-emoji'}>
      <ul className={getStyleClass(className)}>
        {emojis}
      </ul>
    </div>
  );
};
