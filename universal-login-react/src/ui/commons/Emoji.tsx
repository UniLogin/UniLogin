import React from 'react';
import {EMOJI_COLORS, getEmojiNumber} from '@universal-login/commons';
import {getEmojiCodePoint} from '../../core/utils/emojiCodePoint';

interface EmojiProps {
  code: number;
}

export const Emoji = ({code}: EmojiProps) => {
  const emojiNumber = getEmojiNumber(code);
  const colorCode = code % EMOJI_COLORS.length;
  return (
    <i className="fa" style={{color: EMOJI_COLORS[colorCode]}}>
      {String.fromCodePoint(getEmojiCodePoint(emojiNumber))}
    </i>
  );
};
