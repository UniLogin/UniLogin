import {EMOJI_COLORS} from '../constants/emojiColors';

export const getEmojiNumber = (code: number) => Math.floor(code / EMOJI_COLORS.length);

export const getEmojiColor = (code: number) => EMOJI_COLORS[code % EMOJI_COLORS.length];
