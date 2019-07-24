import React from 'react';
import {generateCodeWithFakes} from '@universal-login/commons';

interface SecurityCodeWithFakesProps {
  publicKey: string;
}

export const SecurityCodeWithFakes = ({publicKey}: SecurityCodeWithFakesProps) => {
  const securityCode = generateCodeWithFakes(publicKey);
  const code = securityCode.map((element: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`} style={{display: 'inline'}}>
      {element}
    </li>
  ));

  return (
    <ul>
      {code}
    </ul>
  );
};
