import React from 'react';
import {getEmojiColor, getEmojiNumber} from '@universal-login/commons';
import {getEmojiCodePoint} from '../../core/utils/emojiCodePoint';

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
