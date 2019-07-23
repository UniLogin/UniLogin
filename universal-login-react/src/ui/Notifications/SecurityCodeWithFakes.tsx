import React from 'react';

interface SecurityCodeWithFakesProps {
  securityCode: number[];
}

export const SecurityCodeWithFakes = ({securityCode}: SecurityCodeWithFakesProps) => {
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
