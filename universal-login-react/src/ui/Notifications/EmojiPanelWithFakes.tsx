import React, {useState} from 'react';
import {Emoji} from '../commons/Emoji';
import {generateCodeWithFakes} from '@universal-login/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPanelWithFakesProps {
  publicKey: string;
  onEmojiClick: (code: number) => void;
  className?: string;
}

export const EmojiPanelWithFakes = ({publicKey, onEmojiClick, className}: EmojiPanelWithFakesProps) => {
  const [securityCodeWithFakes] = useState(() => generateCodeWithFakes(publicKey));
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`}>
      <button id={`btn-${code}`} onClick={() => onEmojiClick(code)}>
        <Emoji code={code}/>
      </button>
    </li>
  ));

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <div className="universal-login-emojis">
        <ul className="emojis-fakes-list">
          {emojis}
        </ul>
      </div>
    </div>
  );
};
