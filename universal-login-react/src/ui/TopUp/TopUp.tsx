import React, {useState} from 'react';
import {stringToEther} from '@universal-login/commons';
import {WalletService} from '@universal-login/sdk';
import {Safello} from './OnRamp/Safello';
import {Ramp} from './OnRamp/Ramp';
import {Wyre} from './OnRamp/Wyre';
import {TopUpComponentType} from '../../core/models/TopUpComponentType';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {LogoColor} from './Fiat';
import {TopUpProvider} from '../../core/models/TopUpProvider';
import {toTopUpComponentType} from '../../core/utils/toTopUpComponentType';
import Spinner from '../commons/Spinner';
import './../styles/topUp.sass';
import './../styles/topUpDefaults.sass';
import './../styles/base/chooseTopUp.sass';
import './../styles/themes/Legacy/chooseTopUpThemeLegacy.sass';
import './../styles/themes/Jarvis/chooseTopUpThemeJarvis.sass';
import './../styles/themes/UniLogin/chooseTopUpThemeUniLogin.sass';
import {WaitingForOnRampProvider} from './Fiat/WaitingForOnRampProvider';

export interface TopUpProps {
  walletService: WalletService;
  startModal?: TopUpComponentType;
  modalClassName?: string;
  hideModal?: () => void;
  isModal?: boolean;
  logoColor?: LogoColor;
}

export const TopUp = ({walletService, startModal, modalClassName, hideModal, isModal, logoColor}: TopUpProps) => {
  const [modal, setModal] = useState<TopUpComponentType>(startModal || TopUpComponentType.choose);
  const [amount, setAmount] = useState('');

  const relayerConfig = walletService.sdk.getRelayerConfig();
  const contractAddress = walletService.getContractAddress();

  const onPayClick = (provider: TopUpProvider, amount: string) => {
    setModal(toTopUpComponentType(provider));
    setAmount(amount);
  };

  const getTopUpMethodChooser = () => (
    <ChooseTopUpMethod
      walletService={walletService}
      onPayClick={onPayClick}
      logoColor={logoColor}
    />
  );

  if (!relayerConfig) {
    return <Spinner />;
  } else if (modal === TopUpComponentType.choose) {
    if (isModal) {
      return <ModalWrapper message={walletService.sdk.getNotice()} modalClassName="top-up-modal" hideModal={hideModal}>{getTopUpMethodChooser()}</ModalWrapper>;
    }
    return getTopUpMethodChooser();
  } else if (modal === TopUpComponentType.safello) {
    return (
      <ModalWrapper modalClassName={modalClassName} hideModal={() => setModal(TopUpComponentType.choose)}>
        <Safello
          localizationConfig={{} as any}
          safelloConfig={relayerConfig.onRampProviders.safello}
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
        config={relayerConfig.onRampProviders.ramp}
        onSuccess={() => setModal(TopUpComponentType.waitForRamp)}
        onCancel={() => setModal(TopUpComponentType.choose)}
      />
    );
  } else if (modal === TopUpComponentType.wyre) {
    return (
      <Wyre
        address={contractAddress}
        currency={'ETH'}
        config={relayerConfig.onRampProviders.wyre}
      />
    );
  } else if (modal === TopUpComponentType.waitForRamp) {
    return (
      <WaitingForOnRampProvider
        className={modalClassName}
        onRampProviderName={'ramp'}
        logoColor={logoColor}
      />
    );
  } else {
    throw new Error(`Unsupported type: ${modal}`);
  }
};
