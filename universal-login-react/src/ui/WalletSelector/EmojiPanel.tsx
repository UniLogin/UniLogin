import React from 'react';
import {Emoji} from '../commons/Emoji';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';

interface EmojiPanelProps {
  code: number[];
}

export const EmojiPanel = ({code}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li className="emoji-item" key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <ul className="emoji-panel-list">
      {emojis}
    </ul>
  );
};
