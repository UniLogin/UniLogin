import React, {useState} from 'react';
import {Emoji} from '../commons/Emoji';
import {generateCodeWithFakes} from '@unilogin/commons';
import '../styles/base/emoji.sass';
import '../styles/themes/Legacy/emojiThemeLegacy.sass';
import '../styles/themes/UniLogin/emojiThemeUniLogin.sass';
import '../styles/themes/Jarvis/emojiThemeJarvis.sass';
import {ThemedComponent} from '../commons/ThemedComponent';

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
    <ThemedComponent name="emoji" className={className}>
      <p className='emoji-fakes-title'>Choose icons:</p>
      <ul className="emoji-fakes-list">
        {emojis}
      </ul>
    </ThemedComponent>
  );
};
