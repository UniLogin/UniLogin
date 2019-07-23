import React from 'react';

interface SecurityCodeWithFakesProps {
  securityCode: number[];
}

export const SecurityCodeWithFakes = ({securityCode}: SecurityCodeWithFakesProps) => {
  const code = securityCode.map((element: number, index: number) => (
    <li key={`securityCodeWithFakes_${index}`} className="emoji" style={{display: 'inline'}}> {element} </li>
  ));

  return (
    <ul className="securityCodeWithFakes">
      {code}
    </ul>
  );
};
