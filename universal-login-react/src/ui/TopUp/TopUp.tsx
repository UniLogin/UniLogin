import React, {useState} from 'react';
import TopUpChoose from './TopUpChoose';
import {Safello} from '../../integration/Safello';
import {Ramp} from '../../integration/Ramp';
import {OnRampConfig} from '@universal-login/commons';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';

interface TopUpProps {
  contractAddress: string;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
  topUpClassName?: string;
}

export const TopUp = ({contractAddress, startModal, onRampConfig}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);

  if (modal === TopUpComponentType.choose) {
    return (
      <TopUpChoose onMethodChoose={setModal}/>
    );
  }
  else if (modal === TopUpComponentType.crypto) {
    return (
      <TopUpWithCrypto contractAddress={contractAddress}/>
    );
  }
  else if (modal === TopUpComponentType.bank) {
    return(
      <Ramp
        address={contractAddress}
        amount={'100000000000000'}
      />

      // <Safello
      //   localizationConfig={{} as any}
      //   safelloConfig={onRampConfig.safello}
      //   contractAddress={contractAddress}
      //   crypto="eth"
      // />
    );
  } else {
    throw new Error(`Unsupported type: ${modal}`);
  }
};
