import React from 'react';
import {TopUpProvider} from '../../../core/models/TopUpProvider';
import {classForComponent} from '../../utils/classFor';

type OnRampSuccessInfoProps = {
  onRampProvider: TopUpProvider;
  amount: string;
};

export const OnRampSuccessInfo = ({onRampProvider, amount}: OnRampSuccessInfoProps) =>
  <div className={classForComponent('on-ramp-success-info')}>
    {onRampProvider} has received your request.
    <br/>
    {amount} ETH is going to be on your account soon.
    <br/>
    You may close this window now.
  </div>;
