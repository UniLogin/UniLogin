import React from 'react';
import {Emoji} from '../commons/Emoji';
import {SECURITY_CODE_LENGTH, isCodeSufficientButInvalid} from '@unilogin/commons';
import '../styles/base/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import range from 'lodash.range';
import {ThemedComponent} from '../commons/ThemedComponent';

interface EmojiPlaceholdersProps {
  enteredCode: number[];
  publicKey?: string;
  onEmojiClick?: (index: number) => void;
}

export const EmojiPlaceholders = ({enteredCode, publicKey, onEmojiClick}: EmojiPlaceholdersProps) => {
  const renderEmojis = () =>
    enteredCode.map((code: number, i: number) => (
      <li className="emoji-item" key={i}>
        <button
          onClick={() => onEmojiClick && onEmojiClick(i)}
          className="emoji-keyboard-button"
        >
          <Emoji code={code} />
        </button>
      </li>
    ));

  const renderPlaceholderPanel = () => {
    const emojis = renderEmojis();
    const placeholders = range(emojis.length, SECURITY_CODE_LENGTH)
      .map(index => <li className="emoji-item emoji-item-empty" key={index} />);
    return [...emojis, ...placeholders];
  };

  return (
    <ThemedComponent name="emoji">
      <div className="emoji-placeholders-container">
        <ul className="emoji-placeholders-list">
          {renderPlaceholderPanel()}
        </ul>
        {isCodeSufficientButInvalid(enteredCode, publicKey) && <p className="emoji-input-chosen-invalid">Invalid emoji chosen</p>}
      </div>
    </ThemedComponent>
  );
};
