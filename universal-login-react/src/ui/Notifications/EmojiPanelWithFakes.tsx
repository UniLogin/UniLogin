import React from 'react';
import {Emoji} from '../commons/Emoji';
import {getStyleClass} from '../../core/utils/getStyleClass';
import '../styles/emoji.css';
import '../styles/emojiDefaults.css';

interface EmojiPanelWithFakesProps {
  securityCodeWithFakes: number[];
  onEmojiClicked: (code: number) => void;
  className?: string;
}

export const EmojiPanelWithFakes = ({securityCodeWithFakes, onEmojiClicked, className}: EmojiPanelWithFakesProps) => {
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`} onClick={() => onEmojiClicked(code)} >
      <Emoji code={code}/>
    </li>
  ));

console.log(getStyleClass(className));

  return (
    <div>
      <p>Security code</p>
      <div className={'universal-login-emoji'}>
        <ul className={getStyleClass(className)}>
          {emojis}
        </ul>
      </div>
    </div>
  );
};
