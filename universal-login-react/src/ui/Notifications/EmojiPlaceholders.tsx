import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';
import {SECURITY_CODE_LENGTH} from '@universal-login/commons';
import range from 'lodash.range';

interface EmojiPlaceholdersProps {
  enteredCode: number[];
  isEmojiInputValid: boolean;
  onEmojiClick?: (index: number) => void;
  className?: string;
}

export const EmojiPlaceholders = ({enteredCode, isEmojiInputValid, onEmojiClick, className}: EmojiPlaceholdersProps) => {
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

  const isEmojiInputCompleteButInvalid = enteredCode.length === SECURITY_CODE_LENGTH && !isEmojiInputValid;

  return (
    <div className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <>
          <ul className="emojis-placeholders-list">
            {renderPlaceholderPanel()}
          </ul>
          {isEmojiInputCompleteButInvalid && <p className="emoji-input-chosen-invalid">Invalid emoji chosen</p>}
        </>
      </div>
    </div>
  );
};
