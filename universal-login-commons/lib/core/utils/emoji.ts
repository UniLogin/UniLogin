import {EMOJI_COLORS} from '../constants/emojiColors';
import range from 'lodash.range';

export type EmojiCategory = {
  name: string;
  startIndex: number;
  endIndex: number;
};

export const CATEGORIES: EmojiCategory[] = [
  {name: 'Nature', startIndex: 0, endIndex: 30},
  {name: 'Food', startIndex: 30, endIndex: 60},
  {name: 'Activities', startIndex: 60, endIndex: 90},
  {name: 'Shapes', startIndex: 90, endIndex: 109},
  {name: 'Emojis', startIndex: 109, endIndex: 128}
];

export const getBaseEmojiCode = (iconIndex: number) => iconIndex * EMOJI_COLORS.length;

export const getColoredEmojiCode = (emojiCode: number, colorIndex: number) => emojiCode + colorIndex;

export const getEmojiSet = (category: number) => {
  const interval = CATEGORIES[category];
  return range(interval.startIndex, interval.endIndex).map((iconIndex) => getBaseEmojiCode(iconIndex));
};

export const getEmojiNumber = (code: number) => Math.floor(code / EMOJI_COLORS.length);

export const getEmojiColor = (code: number) => EMOJI_COLORS[code % EMOJI_COLORS.length];
