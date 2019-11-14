import React from 'react';

interface EnsNameProps {
  value: string;
}

export const EnsName = ({value}: EnsNameProps) => {
  const [name, ...domain] = value.split('.');
  return <p><b>{name}.</b>{domain.join('.')}</p>;
};
