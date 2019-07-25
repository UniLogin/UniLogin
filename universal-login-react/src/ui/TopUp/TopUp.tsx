import React from 'react';
import TopUpModalService from '../../core/services/TopUpModalService';
import TopUpChoose from './TopUpChoose';



export const TopUp = () => {
  const topUpModalService = new TopUpModalService();
  return (
    <div>
      <div> Top UP </div>
      <TopUpChoose topUpModalService={topUpModalService}/>
    </div>
  );
};
