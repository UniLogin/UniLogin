import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPlaceholdersProps {
  code: number[];
  onEmojiClicked: (index: number) => void;
  maxLength: number;
  className: string;
}

const emojisButtons = (codes: number[], onEmojiClicked: (index: number) => void) =>
  codes.map((code: number, i: number) => (
    <li key={i}>
      <button onClick={() => onEmojiClicked(i)}>
        <Emoji code={code} />
      </button>
    </li>
  ));

export const EmojiPlaceholders = ({code, onEmojiClicked, maxLength, className}: EmojiPlaceholdersProps) => {

  const renderSelectedEmojis = () => {
    const emojis = emojisButtons(code, onEmojiClicked);

    for (let i = code.length; i < maxLength; i++) {
      emojis.push(<li key={i} />);
    }

    return emojis;
  };

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="universal-login-emojis">
        <ul className="emojis-placeholders-list">
          {renderSelectedEmojis()}
        </ul>
      </div>
    </div>
  );
};
