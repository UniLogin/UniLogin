import React from 'react';
import {Emoji} from '../commons/Emoji';

interface SecurityCodeWithFakesProps {
  securityCodeWithFakes: number[];
  code: number[];
  setCode: (code: number[]) => void;
}

export const SecurityCodeWithFakes = ({securityCodeWithFakes, code, setCode}: SecurityCodeWithFakesProps) => {
  const onEmojiClicked = (index: number, codeValue: number) => {
    if (code.length < 6) {
      code.push(codeValue);
      setCode([...code]);
    }
  };

  const emojis = securityCodeWithFakes.map((code: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`} onClick={() => onEmojiClicked(index, code)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <p>Security code</p>
      <ul style={{display: 'flex', listStyle: 'none'}}>
        {emojis}
      </ul>
    </div>
  );
};
