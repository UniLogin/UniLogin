import {EMOJI_COLORS} from '../constants/emojiColors';
import range from 'lodash.range';

export const CATEGORY_INTERVALS = [
  {start: 0, end: 30},
  {start: 30, end: 60},
  {start: 60, end: 90},
  {start: 90, end: 109},
  {start: 109, end: 128}
];

export const getEmojiCode = (code: number, color: number) => code * 8 + color;

export const getEmojiNumber = (code: number) => Math.floor(code / EMOJI_COLORS.length);

export const getEmojiColor = (code: number) => EMOJI_COLORS[code % EMOJI_COLORS.length];

export const getEmojiSet = (category: number, color: number) => {
  const interval = CATEGORY_INTERVALS[category];
  return range(interval.start, interval.end).map((code) => getEmojiCode(code, color));
};
