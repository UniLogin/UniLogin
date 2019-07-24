import React from 'react';
import {Emoji} from '../commons/Emoji';

interface SecurityCodeProps {
  code: number[];
}

export const SecurityCode = ({code}: SecurityCodeProps) => {
  const emojis = code.map((code: number, index: number) => (
    <li key={`securityCode_${index}`}>
      <Emoji code={code}/>
    </li>
  ));

  return (
    <div>
      <ul style={{display: 'flex', listStyle: 'none'}}>
        {emojis}
      </ul>
    </div>
  );
};
