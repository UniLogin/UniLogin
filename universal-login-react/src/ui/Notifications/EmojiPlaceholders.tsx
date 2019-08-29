import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';
import {SECURITY_CODE_LENGTH} from '@universal-login/commons';
import range from 'lodash.range';


interface EmojiPlaceholdersProps {
  enteredCode: number[];
  onEmojiClick: (index: number) => void;
  className?: string;
}

export const EmojiPlaceholders = ({enteredCode, onEmojiClick, className}: EmojiPlaceholdersProps) => {
  const renderEmojis = () =>
    enteredCode.map((code: number, i: number) => (
      <li key={i}>
        <button onClick={() => onEmojiClick(i)}>
          <Emoji code={code} />
        </button>
      </li>
    ));

  const renderPlaceholderPanel = () => {
    const emojis = renderEmojis();
    const placeholders = range(emojis.length, SECURITY_CODE_LENGTH)
      .map(index => <li key={index} />);
    return [...emojis, ...placeholders];
  };

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="universal-login-emojis">
        <ul className="emojis-placeholders-list">
          {renderPlaceholderPanel()}
        </ul>
      </div>
    </div>
  );
};
