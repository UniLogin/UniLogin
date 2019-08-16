import {EMOJI_COLORS} from '../constants/emojiColors';

export const getEmojiNumber = (code: number) => Math.floor(code / EMOJI_COLORS.length);

