import React, {useState} from 'react';
import {EMOJI_COLORS, getEmojiSet, getColoredEmojiCode, CATEGORIES} from '@unilogin/commons';
import {Emoji} from '../commons/Emoji';
import '../styles/base/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import {ThemedComponent} from '../commons/ThemedComponent';

interface EmojiKeyboardProps {
  onEmojiClick: (code: number) => void;
  className?: string;
}

export const EmojiKeyboard = ({onEmojiClick, className}: EmojiKeyboardProps) => {
  const [category, setCategory] = useState(0);
  const [palette, setPalette] = useState<number | undefined>(undefined);

  const renderKeyboard = () =>
    getEmojiSet(category).map((emojiCode, index: number) => renderInputEmoji(emojiCode, index));

  const renderInputEmoji = (emojiCode: number, index: number) => (
    <li className="emoji-item" key={`securityCodeWithFakes_${emojiCode}`}>
      <button
        id={`btn-${emojiCode}`}
        onClick={() => palette === index ? setPalette(undefined) : setPalette(index)}
        className="emoji-keyboard-button"
      >
        <Emoji code={emojiCode}/>
      </button>
      {palette === index
        ? <ul className="emoji-keyboard-color-row">
          {renderColors(emojiCode)}
        </ul>
        : null }
    </li>
  );

  const renderColors = (emojiCode: number) => (
    EMOJI_COLORS.map((colorString: string, colorIndex: number) => (
      <li key={`li-color-${colorIndex}`} className="emoji-keyboard-color-item">
        <button
          style={{backgroundColor: colorString}}
          id={`btn-color-${colorIndex}`}
          onClick={() => onColorClick(getColoredEmojiCode(emojiCode, colorIndex))}
          className="emoji-keyboard-color-button"
        />
      </li>
    ))
  );

  const onColorClick = (coloredEmojiCode: number) => {
    onEmojiClick(coloredEmojiCode);
    setPalette(undefined);
  };

  const renderCategories = () => (
    CATEGORIES.map(({name}: {name: string}, index: number) => (
      <li
        key={`li-category-${name}`}
        className={`emoji-category-item ${category === index ? 'active' : ''}`}
      >
        <button
          onClick={() => setCategory(index)}
          className={`emoji-category-button emoji-category-${name.toLowerCase()}`}
        >
          {name}
        </button>
      </li>
    ))
  );

  return (
    <ThemedComponent name="emoji" className={className}>
      <div className="emoji-keyboard">
        <ul className="emoji-category-row">
          {renderCategories()}
        </ul>
        <div className="emoji-keyboard-row">
          <button
            disabled={category === 0}
            onClick={() => setCategory(category - 1)}
            className="emoji-keyboard-arrow-button emoji-keyboard-prev"
          />
          <ul className="emoji-keyboard-batch">
            {renderKeyboard()}
          </ul>
          <button
            disabled={category === 4}
            onClick={() => setCategory(category + 1)}
            className="emoji-keyboard-arrow-button emoji-keyboard-next"
          />
        </div>
      </div>
    </ThemedComponent>
  );
};
