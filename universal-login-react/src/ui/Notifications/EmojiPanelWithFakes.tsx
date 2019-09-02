import React, {useState} from 'react';
import {Emoji} from '../commons/Emoji';
import {generateCodeWithFakes} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';

interface EmojiPanelWithFakesProps {
  publicKey: string;
  onEmojiClick: (code: number) => void;
  className?: string;
}

export const EmojiPanelWithFakes = ({publicKey, onEmojiClick, className}: EmojiPanelWithFakesProps) => {
  const [securityCodeWithFakes] = useState(() => generateCodeWithFakes(publicKey));
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li className="emoji-item" key={`securityCodeWithFakes_${index}`}>
      <button
        id={`btn-${code}`}
        onClick={() => onEmojiClick(code)}
        className="emoji-keyboard-button"
      >
        <Emoji code={code}/>
      </button>
    </li>
  ));

  return (
    <div className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <ul className="emojis-fakes-list">
          {emojis}
        </ul>
      </div>
    </div>
  );
};
