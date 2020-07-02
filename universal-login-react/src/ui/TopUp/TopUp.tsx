import React, {useState} from 'react';
import {WalletService} from '@unilogin/sdk';
import {ChooseTopUpMethod} from './ChooseTopUpMethod';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {LogoColor, TopUpWithFiat} from './Fiat';
import './../styles/base/chooseTopUp.sass';
import './../styles/themes/Legacy/chooseTopUpThemeLegacy.sass';
import './../styles/themes/Jarvis/chooseTopUpThemeJarvis.sass';
import './../styles/themes/UniLogin/chooseTopUpThemeUniLogin.sass';
import {TopUpMethod} from '../../core/models/TopUpMethod';
import {TopUpWithCrypto} from './TopUpWithCrypto';

export interface TopUpProps {
  walletService: WalletService;
  hideModal?: () => void;
  isModal?: boolean;
  logoColor?: LogoColor;
}

export const TopUp = ({walletService, hideModal, isModal, logoColor}: TopUpProps) => {
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  const topUpToken = walletService.isKind('Future') ? walletService.getFutureWallet().getTopUpToken() : undefined;

  const renderTopUpContent = () => (<>
    {headerVisible && <ChooseTopUpMethod
      topUpMethod={topUpMethod}
      setTopUpMethod={setTopUpMethod}
      topUpToken={topUpToken}
    />}
    {topUpMethod === 'fiat' &&
      <TopUpWithFiat
        walletService={walletService}
        logoColor={logoColor}
        setHeaderVisible={setHeaderVisible}
        hideModal={hideModal}
      />}
    {topUpMethod === 'crypto' &&
      <TopUpWithCrypto
        walletService={walletService}
      />}
  </>);

  if (isModal) {
    return <ModalWrapper message={walletService.sdk.getNotice()} hideModal={hideModal}>
      {renderTopUpContent()}
    </ModalWrapper>;
  }
  return renderTopUpContent();
};
