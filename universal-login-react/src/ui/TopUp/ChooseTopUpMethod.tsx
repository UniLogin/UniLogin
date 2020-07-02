import React from 'react';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {ChooseTopUpMethodWrapper} from './ChooseTopUpMethodWrapper';
import {ChooseTopUpMethodHeader} from './ChooseTopUpMethodHeader';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {classForComponent} from '../utils/classFor';
import {CompanyLogo} from '../commons/CompanyLogo';
import {TokenDetails} from '@unilogin/commons';

export interface ChooseTopUpMethodProps {
  setTopUpMethod: (any: any) => void;
  topUpMethod: TopUpMethod;
  topUpToken?: TokenDetails;
}

export const ChooseTopUpMethod = ({topUpMethod, setTopUpMethod, topUpToken}: ChooseTopUpMethodProps) => {
  return (
    <ChooseTopUpMethodWrapper topUpMethod={topUpMethod}>
      <CompanyLogo />
      <div className={classForComponent('onboarding-progress-wrapper')}>
        <ModalProgressBar steps={4} progress={3}/>
      </div>
      <ChooseTopUpMethodHeader
        topUpMethod={topUpMethod}
        setTopUpMethod={setTopUpMethod}
        topUpToken={topUpToken}
      />
    </ChooseTopUpMethodWrapper>
  );
};
