import React, {useState} from 'react';
import {OnRampConfig, stringToEther} from '@universal-login/commons';
import {Safello} from '../../integration/Safello';
import {Ramp} from '../../integration/Ramp';
import {TopUpWithCrypto} from './TopUpWithCrypto';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';


interface TopUpProps {
  contractAddress: string;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
  topUpClassName?: string;
  hideModal?: () => void;
}

export const TopUp = ({contractAddress, startModal, onRampConfig, hideModal}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  const [amount] = useState<string>('');

  if (modal === TopUpComponentType.choose) {
    return (
      <ChooseTopUpMethod
        contractAddress={contractAddress}
        onRampConfig={onRampConfig}
        onPayClick={setModal}
      />
    );
  }
  else if (modal === TopUpComponentType.crypto) {
    return (
      <TopUpWithCrypto contractAddress={contractAddress}/>
    );
  } else if (modal === TopUpComponentType.safello) {
    return (
      <Safello
        localizationConfig={{} as any}
        safelloConfig={onRampConfig.safello}
        contractAddress={contractAddress}
        crypto="eth"
      />
    );
  } else if (modal === TopUpComponentType.ramp) {
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
