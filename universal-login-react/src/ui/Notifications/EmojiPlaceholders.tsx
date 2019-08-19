import React from 'react';
import {Emoji} from '../commons/Emoji';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPlaceholdersProps {
  code: number[];
  onEmojiClicked: (index: number) => void;
  maxLength: number;
}

export const EmojiPlaceholders = ({code, onEmojiClicked, maxLength}: EmojiPlaceholdersProps) => {
  const renderSelectedEmojis = () => {
    const emojis = [];

    for (let i = 0; i < maxLength; i++) {
      if (typeof code[i] === 'number') {
        emojis.push(
          <li key={i}>
            <button onClick={() => onEmojiClicked(i)}>
              <Emoji code={code[i]}/>
            </button>
          </li>
        );
      } else {
        emojis.push(<li key={i} />);
      }
    }

    return emojis;
  };

  return (
    <ul className="emojis-placeholders-list">
      {renderSelectedEmojis()}
    </ul>
  );
};
