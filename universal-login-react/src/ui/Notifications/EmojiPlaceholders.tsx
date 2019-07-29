import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleClass} from '../../core/utils/getStyleClass';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPlaceholdersProps {
  code: number[];
  onEmojiClicked: (index: number) => void;
  className?: string;
}

export const EmojiPlaceholders = ({code, onEmojiClicked, className}: EmojiPlaceholdersProps) => {
  const placeholders = code.map((code: number, index: number) => (
    <li key={`emoji_placeholder_${index}`}  onClick={() => onEmojiClicked(index)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div className={'universal-login-emoji'}>
      <ul className={getStyleClass(className)}>
        {placeholders}
      </ul>
    </div>
  );
};
