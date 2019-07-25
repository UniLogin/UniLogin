import React from 'react';
import {getIconFilename} from '../../core/utils/iconDictionary';

interface EmojiProps {
  code: number;
}

export const Emoji = ({code}: EmojiProps) => {
  const emojiPath = `emojis/${getIconFilename(code)}`;
  return (
    <div>
      <img src={emojiPath} alt={`${code}`}/>
    </div>
  );
};
