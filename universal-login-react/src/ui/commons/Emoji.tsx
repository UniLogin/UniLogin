import React from 'react';
import {getEmojiCodePoint} from '../../core/utils/emojiCodePoint';

interface EmojiProps {
  code: number;
}

const colors = [
  '#B9C3F8',
  '#F5FF98',
  '#0FB989',
  '#FFAEFC',
  '#3C93FF',
  '#FFB475',
  '#9A5AFF',
  '#FF6C6C'
];

export const Emoji = ({code}: EmojiProps) => {
  const emojiNumber = Math.floor(code / colors.length);
  const colorCode = code % colors.length;
  return (
    <i className="fa" style={{color: colors[colorCode]}}>
      {String.fromCodePoint(getEmojiCodePoint(emojiNumber))}
    </i>
  );
};
