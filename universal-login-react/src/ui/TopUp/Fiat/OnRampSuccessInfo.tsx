import React from 'react';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {classForComponent} from '../../utils/classFor';
import {CloseButton} from '../../commons/Buttons/CloseButton';

type OnRampSuccessInfoProps = {
  onRampProvider: TopUpProvider;
  amount: string;
  currency: string;
  hideModal?: () => void;
};

export const OnRampSuccessInfo = ({onRampProvider, amount, hideModal, currency}: OnRampSuccessInfoProps) =>
  <div className={classForComponent('on-ramp-success-info')}>
    {hideModal && <CloseButton onClick={hideModal} />}
    {onRampProvider} has received your request.
    <br/>
    {amount} {currency} is going to be on your account soon.
    <br/>
      You may close this window now.
  </div>;
