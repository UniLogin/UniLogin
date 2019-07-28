import React from 'react';
import {Emoji} from '../commons/Emoji';

interface EmojiPanelWithFakesProps {
  securityCodeWithFakes: number[];
  onEmojiClicked: (code: number) => void;
}

export const EmojiPanelWithFakes = ({securityCodeWithFakes, onEmojiClicked}: EmojiPanelWithFakesProps) => {
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`} onClick={() => onEmojiClicked(code)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <p>Security code</p>
      <ul className={'universal-login-emoji-default'}>
        {emojis}
      </ul>
    </div>
  );
};
