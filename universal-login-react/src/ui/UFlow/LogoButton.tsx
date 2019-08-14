import React from 'react';
import logoIcon from '../assets/icons/U.svg';
import {createModalService} from '../../core/services/createModalService';
import {UDashboard} from '../Modals/UDashboard';
import {ReactUModalType, ReactUModalProps, ReactUModalContext} from '../../core/models/ReactUModalContext';
import UniversalLoginSDK, {TokensDetailsStore, TransferService, WalletService} from '@universal-login/sdk';

export interface LogoButtonProps {
  walletService: WalletService;
  sdk: UniversalLoginSDK;
  tokensDetailsStore: TokensDetailsStore;
  transferService: TransferService;
}

export const LogoButton = ({walletService, sdk, tokensDetailsStore, transferService}: LogoButtonProps) => {
  const modalService = createModalService<ReactUModalType, ReactUModalProps>();


  return (
    <>
      <ReactUModalContext.Provider value={modalService}>
        <button onClick={() => modalService.showModal('funds')}>
          <img src={logoIcon} alt="U"/>
        </button>
        <UDashboard
          walletService={walletService}
          sdk={sdk}
          tokensDetailsStore={tokensDetailsStore}
          transferService={transferService}
        />
      </ReactUModalContext.Provider>
    </>
  );
};
