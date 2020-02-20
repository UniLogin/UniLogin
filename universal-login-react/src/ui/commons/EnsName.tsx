import React from 'react';
import {parseDomain} from '@unilogin/commons';
import {classForComponent} from '../utils/classFor';

interface EnsNameProps {
  value: string;
}

export const EnsName = ({value}: EnsNameProps) => {
  const [name, domain] = parseDomain(value);
  return <p className={classForComponent('ens-name')}><b>{name}</b>.{domain}</p>;
};
