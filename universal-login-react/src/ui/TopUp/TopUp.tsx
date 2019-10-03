import React, {useState} from 'react';
import {OnRampConfig, OnGasParametersChanged, stringToEther, DEPLOY_GAS_LIMIT} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {Safello} from '../../integration/Safello';
import {Ramp} from '../../integration/Ramp';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {LogoColor} from './Fiat/FiatPaymentMethods';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {toTopUpComponentType} from '../../core/utils/toTopUpComponentType';
import {GasPrice} from '../commons/GasPrice';

interface TopUpProps {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onGasParametersChanged: OnGasParametersChanged;
  startModal?: TopUpComponentType;
  onRampConfig: OnRampConfig;
  topUpClassName?: string;
  modalClassName?: string;
  hideModal?: () => void;
  isModal?: boolean;
  logoColor?: LogoColor;
}

export const TopUp = ({sdk, onGasParametersChanged, contractAddress, startModal, onRampConfig, modalClassName, hideModal, isModal, topUpClassName, logoColor}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  const [amount, setAmount] = useState('');

  const onPayClick = (provider: TopUpProvider, amount: string) => {
    setModal(toTopUpComponentType(provider));
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
            logoColor={logoColor}
          />
          <GasPrice
            isDeployed={false}
            sdk={sdk}
            onGasParametersChanged={onGasParametersChanged}
            gasLimit={DEPLOY_GAS_LIMIT}
            className={topUpClassName}
          />
        </ModalWrapper>
      );
    }
    return (
      <>
        <ChooseTopUpMethod
          contractAddress={contractAddress}
          onPayClick={onPayClick}
          topUpClassName={topUpClassName}
          logoColor={logoColor}
        />
        <GasPrice
          isDeployed={false}
          sdk={sdk}
          onGasParametersChanged={onGasParametersChanged}
          gasLimit={DEPLOY_GAS_LIMIT}
          className={topUpClassName}
        />
      </>
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
