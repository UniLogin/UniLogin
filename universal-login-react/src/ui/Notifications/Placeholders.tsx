import React, {useState, useEffect} from 'react';
import {SECURITY_CODE_LENGTH} from '@universal-login/commons';

interface PlaceholdersProps {
  setSecurityCode: (code: number[]) => void;
}

export const Placeholders = ({setSecurityCode}: PlaceholdersProps) => {
  const [code, setCode] = useState([0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    
  })

  const placeholders = [...Array(SECURITY_CODE_LENGTH).keys()].map((element: number, index: number) => (
    <li key={`placeholder_${index}`} style={{display: 'inline'}}>
      {element}
    </li>
  ));

  return (
    <ul>
      {placeholders}
    </ul>
  );
};
