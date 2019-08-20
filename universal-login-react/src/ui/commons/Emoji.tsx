import React from 'react';
import {getEmojiCodePoint, getEmojiColor, getEmojiNumber} from '@universal-login/commons';

interface EmojiProps {
  code: number;
}

export const Emoji = ({code}: EmojiProps) => {
  const emojiNumber = getEmojiNumber(code);
  const color = getEmojiColor(code);
  return (
    <i className="fa" style={{color}}>
      {String.fromCodePoint(getEmojiCodePoint(emojiNumber))}
    </i>
  );
};
