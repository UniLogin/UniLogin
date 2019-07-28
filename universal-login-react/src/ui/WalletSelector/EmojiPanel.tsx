import React from 'react';
import {Emoji} from '../commons/Emoji';

interface EmojiPanelProps {
  code: number[];
}

export const EmojiPanel = ({code}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <ul className={'universal-login-emoji-default'}>
        {emojis}
      </ul>
    </div>
  );
};
