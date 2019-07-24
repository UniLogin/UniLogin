import React from 'react';

export interface TopUpChoiceProps {
  name: string;
}

export const TopUpChoice = ({name}: TopUpChoiceProps) => (
  <a onClick={() => console.log(name)}>
    {name}
  </a>
);
