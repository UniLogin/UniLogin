import React from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';
import {ChooseTopUpMethodHeader} from './ChooseTopUpMethodHeader';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {classForComponent} from '../utils/classFor';
import {CompanyLogo} from '../commons/CompanyLogo';

export interface ChooseTopUpMethodProps {
  setTopUpMethod: (any: any) => void;
  topUpMethod: TopUpMethod;
}

export const ChooseTopUpMethod = ({topUpMethod, setTopUpMethod}: ChooseTopUpMethodProps) => {
  return (
    <ChooseTopUpMethodWrapper topUpMethod={topUpMethod}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={3} progress={2}/>
      </div>
      <ChooseTopUpMethodHeader
        topUpMethod={topUpMethod}
        setTopUpMethod={setTopUpMethod}
      />
    </ChooseTopUpMethodWrapper>
  );
};
