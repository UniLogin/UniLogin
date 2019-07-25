import React, {useState} from 'react';
import TopUpChoose from './TopUpChoose';
import {Safello} from '../../integration/Safello';
import {OnRampConfig} from '@universal-login/commons';

export enum TopUpComponentType {
  'choose',
  'creditcard',
  'bank',
  'crypto'
}

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


interface TopUpWithCryptoProps {
  contractAddress: string;
}

export const TopUpWithCrypto = ({contractAddress}: TopUpWithCryptoProps) => {
  return(<div> Transfer crypto to your wallet: {contractAddress} </div>);
};
