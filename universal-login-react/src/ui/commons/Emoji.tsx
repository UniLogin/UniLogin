import React from 'react';
import {getEmojiCodePoint} from '../../core/utils/emojiCodePoint';

interface EmojiProps {
  code: number;
}

const colors = [
  'red',
  'black',
  'blue',
  'green',
  'yellow',
  'orange',
  'aqua',
  'fuchsia',
  'lime',
  'gray'
];

export const Emoji = ({code}: EmojiProps) => {
  const emojiNumber = Math.floor(code / colors.length);
  const colorCode = code % colors.length;
  return (
    <i className="fa" style={{color: colors[colorCode], fontSize: 25}}>
      {String.fromCodePoint(getEmojiCodePoint(emojiNumber))}
    </i>
  );
};
