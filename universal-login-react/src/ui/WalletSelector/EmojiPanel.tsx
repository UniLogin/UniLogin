import React from 'react';
import {Emoji} from '../commons/Emoji';

interface EmojiPanelProps {
  code: number[];
}

export const EmojiPanel = ({code}: EmojiPanelProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li style={{margin: '10px'}} key={`emojiPanel_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <ul style={{display: 'flex', listStyle: 'none'}}>
        {emojis}
      </ul>
    </div>
  );
};
