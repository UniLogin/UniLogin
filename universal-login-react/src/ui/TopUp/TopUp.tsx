import React from 'react';
import TopUpModalService from '../../core/services/TopUpModalService';
import TopUpChoose from './TopUpChoose';

interface TopUpProps {
  contractAddress: string;
}

export const TopUp = (props: TopUpProps) => {
  const topUpModalService = new TopUpModalService();
  return (
    <div>
      <div> Top UP </div>
      <TopUpChoose topUpModalService={topUpModalService} {...props}/>
    </div>
  );
};
