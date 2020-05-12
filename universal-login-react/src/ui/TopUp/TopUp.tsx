import React, {useState} from 'react';
import {WalletService, InvalidWalletState} from '@unilogin/sdk';
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
import {ensure} from '@unilogin/commons';

export interface TopUpProps {
  walletService: WalletService;
  modalClassName?: string;
  hideModal?: () => void;
  isModal?: boolean;
  logoColor?: LogoColor;
}

export const TopUp = ({walletService, modalClassName, hideModal, isModal, logoColor}: TopUpProps) => {
  const [topUpMethod, setTopUpMethod] = useState<TopUpMethod>(undefined);
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);
  ensure(walletService.state.kind === 'Future', InvalidWalletState, 'Future', walletService.state.kind);
  const topUpCurrency = walletService.sdk.tokensDetailsStore.getTokenByAddress(walletService.state.wallet.gasToken).symbol;

  const renderTopUpContent = () => (<>
    {headerVisible && <ChooseTopUpMethod
      topUpMethod={topUpMethod}
      setTopUpMethod={setTopUpMethod}
      topUpCurrency={topUpCurrency}
    />}
    {topUpMethod === 'fiat' &&
      <TopUpWithFiat
        walletService={walletService}
        logoColor={logoColor}
        modalClassName={modalClassName}
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
