import React, {useState} from 'react';
import {Emoji} from '../commons/Emoji';
import {generateCodeWithFakes} from '@unilogin/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import '../styles/emoji.sass';
import '../styles/emojiDefaults.sass';
import {useThemeClassFor} from '../utils/classFor';

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
    <div className={`${useThemeClassFor()} universal-login-emojis`}>
      <div className={getStyleForTopLevelComponent(className)}>
        <p className='emojis-fakes-title'>Choose icons:</p>
        <ul className="emojis-fakes-list">
          {emojis}
        </ul>
      </div>
    </div>
  );
};
