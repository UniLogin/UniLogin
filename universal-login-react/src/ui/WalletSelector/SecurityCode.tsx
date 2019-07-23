import React from 'react';

interface SecurityCodeProps {
  securityCode: number[];
}

export const SecurityCode = ({securityCode}: SecurityCodeProps) => {
  const codes = securityCode.map((element: number, index: number) => (
    <li key={`securityCode_${index}`} className="emoji" style={{display: 'inline'}}> {element} </li>
  ));

  return (
    <ul>
      {codes}
    </ul>
  );
};
