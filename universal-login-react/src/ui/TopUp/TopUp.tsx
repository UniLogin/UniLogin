import React, {useState} from 'react';
import TopUpChoose from './TopUpChoose';
import {Safello} from '../../integration/Safello';
import {OnRampConfig} from '@universal-login/commons';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';

interface TopUpProps {
  contractAddress: string;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
}

export const TopUp = ({contractAddress, startModal, onRampConfig}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  if (modal === TopUpComponentType.choose) {
    return (<TopUpChoose onMethodChoose={setModal}/>);
  } else if (modal === TopUpComponentType.crypto) {
    return (<TopUpWithCrypto contractAddress={contractAddress}/>);
  } else if (modal === TopUpComponentType.bank) {
    return(
      <Safello
        localizationConfig={{} as any}
        safelloConfig={onRampConfig.safello}
        contractAddress={contractAddress}
        crypto="eth"
      />
    );
  } else {
    throw new Error(`Unsupported type: ${modal}`);
  }
};
