import React from 'react';
import {Emoji} from '../commons/Emoji';

interface EmojiPlaceholdersProps {
  code: number[];
  onEmojiClicked: (index: number) => void;
}

export const EmojiPlaceholders = ({code, onEmojiClicked}: EmojiPlaceholdersProps) => {
  const placeholders = code.map((code: number, index: number) => (
    <li key={`emoji_placeholder_${index}`}  onClick={() => onEmojiClicked(index)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <ul className={'universal-login-emoji-default'}>
      {placeholders}
    </ul>
  );
};
