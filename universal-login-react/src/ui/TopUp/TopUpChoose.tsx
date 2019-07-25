import React from 'react';
import {TopUpComponentType} from './TopUp';


interface TopUpChooseProps {
  onMethodChoose: (topUpModalType: TopUpComponentType) => void;
}

export const TopUpChoose = ({onMethodChoose}: TopUpChooseProps) => {
  return(
    <div>
      <div onClick={() => onMethodChoose(TopUpComponentType.creditcard)}> Credit Card</div>
      <div onClick={() => onMethodChoose(TopUpComponentType.bank)}> Bank </div>
      <div onClick={() => onMethodChoose(TopUpComponentType.crypto)}> Crypto</div>
    </div>
  );
};

export default TopUpChoose;
