import React, {ReactNode} from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {ThemedComponent} from '../commons/ThemedComponent';

interface ChooseTopUpMethodWrapperProps {
  children: ReactNode;
  topUpMethod?: TopUpMethod;
};

export const ChooseTopUpMethodWrapper = ({children, topUpMethod}: ChooseTopUpMethodWrapperProps) => (
  <ThemedComponent name="top-up" className={topUpMethod ? 'method-selected' : ''}>
    {children}
  </ThemedComponent>
);
