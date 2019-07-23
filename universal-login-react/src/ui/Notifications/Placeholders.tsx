import React from 'react';
import {SECURITY_CODE_LENGTH} from '@universal-login/commons';

export const Placeholders = () => {
  const placeholders = [...Array(SECURITY_CODE_LENGTH).keys()].map((element: number, index: number) => (
    <li key={`placeholder_${index}`} style={{display: 'inline'}}> {element} </li>
  ));

  return (
    <ul className="placeholders">
      {placeholders}
    </ul>
  );
};
