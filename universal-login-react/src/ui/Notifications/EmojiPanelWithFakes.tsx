import React, {useState} from 'react';
import {Emoji} from '../commons/Emoji';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';
import {generateCodeWithFakes} from '@universal-login/commons';

interface EmojiPanelWithFakesProps {
  publicKey: string;
  onEmojiClicked: (code: number) => void;
  className?: string;
}

export const EmojiPanelWithFakes = ({publicKey, onEmojiClicked, className}: EmojiPanelWithFakesProps) => {
  const [securityCodeWithFakes] = useState(() => generateCodeWithFakes(publicKey));
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`}>
      <button id={`btn-${code}`} onClick={() => onEmojiClicked(code)}>
        <Emoji code={code}/>
      </button>
    </li>
  ));

  return (
    <ul className="emojis-fakes-list">
      {emojis}
    </ul>
  );
};
