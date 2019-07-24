import React from 'react';
import {Emoji} from '../commons/Emoji';

interface PlaceholdersProps {
  code: number[];
  setCode: (code: number[]) => void;
}

export const Placeholders = ({code, setCode}: PlaceholdersProps) => {
  const onEmojiClicked = (index: number, codeValue: number) => {
    if (code.length >= 0) {
      code.splice(index, 1);
      setCode([...code]);
    }
  };

  const placeholders = code.map((code: number, index: number) => (
    <li key={`placeholder_${index}`}  onClick={() => onEmojiClicked(index, code)} >
      <Emoji code={code}/>
    </li>
  ));

  return (
    <ul style={{display: 'flex', listStyle: 'none'}}>
      {placeholders}
    </ul>
  );
};
