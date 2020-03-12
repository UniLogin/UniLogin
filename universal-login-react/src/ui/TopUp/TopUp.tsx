import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {LogoColor, TopUpWithFiat} from './Fiat';
import './../styles/topUp.sass';
import './../styles/topUpDefaults.sass';
import './../styles/base/chooseTopUp.sass';
import './../styles/themes/Legacy/chooseTopUpThemeLegacy.sass';
import './../styles/themes/Jarvis/chooseTopUpThemeJarvis.sass';
import './../styles/themes/UniLogin/chooseTopUpThemeUniLogin.sass';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpWithCrypto} from './TopUpWithCrypto';

export interface TopUpProps {
  walletService: WalletService;
  modalClassName?: string;
  hideModal?: () => void;
  isModal?: boolean;
  logoColor?: LogoColor;
}

export const TopUp = ({walletService, modalClassName, hideModal, isModal, logoColor}: TopUpProps) => {
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);

  const renderTopUpContent = () => (<>
    <ChooseTopUpMethod
      topUpMethod={topUpMethod}
      setTopUpMethod={setTopUpMethod}
    />
    {topUpMethod === 'fiat' &&
      <TopUpWithFiat
        walletService={walletService}
        logoColor={logoColor}
        modalClassName={modalClassName}
      />}
    {topUpMethod === 'crypto' &&
      <TopUpWithCrypto
        walletService={walletService}
      />}
  </>);

  if (isModal) {
    return <ModalWrapper message={walletService.sdk.getNotice()} modalClassName="top-up-modal" hideModal={hideModal}>
      {renderTopUpContent()}
    </ModalWrapper>;
  }
  return renderTopUpContent();
};
