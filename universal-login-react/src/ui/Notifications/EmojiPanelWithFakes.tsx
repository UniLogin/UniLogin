import React from 'react';
import {Emoji} from '../commons/Emoji';

interface EmojiPanelWithFakesProps {
  securityCodeWithFakes: number[];
  onEmojiClicked: (code: number) => void;
}

export const EmojiPanelWithFakes = ({securityCodeWithFakes, onEmojiClicked}: EmojiPanelWithFakesProps) => {
  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li style={{margin: '10px'}} key={`securityCodeWithFakes_${index}`} onClick={() => onEmojiClicked(code)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <p>Security code</p>
      <ul style={{display: 'flex', listStyle: 'none', flexWrap: 'wrap'}}>
        {emojis}
      </ul>
    </div>
  );
};
