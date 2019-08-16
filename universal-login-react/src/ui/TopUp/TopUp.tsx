import React, {useState} from 'react';
import {OnRampConfig, stringToEther} from '@universal-login/commons';
import {Safello} from '../../integration/Safello';
import {Ramp} from '../../integration/Ramp';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';
import {ModalWrapper} from '../Modals/ModalWrapper';

interface TopUpProps {
  contractAddress: string;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
  topUpClassName?: string;
  modalClassName?: string;
  hideModal?: () => void;
  isModal?: boolean;
}

export const TopUp = ({contractAddress, startModal, onRampConfig, modalClassName, hideModal, isModal, topUpClassName}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  const [amount, setAmount] = useState('');

  const onPayClick = (topUpType: TopUpComponentType, amount: string) => {
    setModal(topUpType);
    setAmount(amount);
  };

  if (modal === TopUpComponentType.choose) {
    if (isModal) {
      return (
        <ModalWrapper modalClassName={modalClassName} hideModal={hideModal}>
          <ChooseTopUpMethod
            contractAddress={contractAddress}
            onPayClick={onPayClick}
            topUpClassName={topUpClassName}
          />
        </ModalWrapper>
      );
    }
    return (
      <ChooseTopUpMethod
        contractAddress={contractAddress}
        onPayClick={onPayClick}
        topUpClassName={topUpClassName}
      />
    );
  } else if (modal === TopUpComponentType.safello) {
    return (
      <ModalWrapper modalClassName={modalClassName} hideModal={() => setModal(TopUpComponentType.choose)}>
        <Safello
          localizationConfig={{} as any}
          safelloConfig={onRampConfig.safello}
          contractAddress={contractAddress}
          crypto="eth"
        />
      </ModalWrapper>
    );
  } else if (modal === TopUpComponentType.ramp) {
    return (
      <Ramp
        address={contractAddress}
        amount={stringToEther(amount)}
        currency={'ETH'}
        config={onRampConfig.ramp}
        onClose={() => setModal(TopUpComponentType.choose)}
      />
    );
  } else {
    throw new Error(`Unsupported type: ${modal}`);
  }
};
