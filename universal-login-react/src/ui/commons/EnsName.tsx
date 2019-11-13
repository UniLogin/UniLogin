import React from 'react';

interface EnsNameProps {
  value: string;
}

export const EnsName = ({value}: EnsNameProps) => {
  const split = value.split('.');
  return <p><b>{split.shift()}.</b>{split.join('.')}</p>;
};
