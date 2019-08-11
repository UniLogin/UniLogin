import React, {useState} from 'react';
import {OnRampConfig, stringToEther} from '@universal-login/commons';
import TopUpChoose from './TopUpChoose';
import {Safello} from '../../integration/Safello';
import {TopUpAmount} from './TopUpAmount';
import {Ramp} from '../../integration/Ramp';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';


interface TopUpProps {
  contractAddress: string;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
  topUpClassName?: string;
  hideModal?: () => void;
}

export const TopUp = ({contractAddress, startModal, onRampConfig, hideModal}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  const [amount, setAmount] = useState<string>('');

  if (!amount) {
    return (
      <TopUpAmount onNextClick={setAmount}/>
    );
  } else if (modal === TopUpComponentType.choose) {
    return (
      <TopUpChoose onMethodChoose={setModal}/>
    );
  } else if (modal === TopUpComponentType.crypto) {
    return (
      <TopUpWithCrypto contractAddress={contractAddress}/>
    );
  } else if (modal === TopUpComponentType.creditcard) {
    return (
      <Safello
        localizationConfig={{} as any}
        safelloConfig={onRampConfig.safello}
        contractAddress={contractAddress}
        crypto="eth"
      />
    );
  } else if (modal === TopUpComponentType.bank) {
    hideModal ? hideModal() : null;
    return(
      <Ramp
        address={contractAddress}
        amount={stringToEther(amount)}
        currency={'ETH'}
        config={onRampConfig.ramp}
      />
    );
  } else {
    throw new Error(`Unsupported type: ${modal}`);
  }
};
