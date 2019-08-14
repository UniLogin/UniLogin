import React from 'react';
import logoIcon from '../assets/icons/U.svg';
import {createModalService} from '../../core/services/createModalService';
import {UDashboard} from '../Modals/UDashboard';
import {ReactUModalType, ReactUModalProps, ReactUModalContext} from '../../core/models/ReactUModalContext';
import {ApplicationWallet} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';

export interface LogoButtonProps {
  applicationWallet: ApplicationWallet;
  sdk: UniversalLoginSDK;
}

export const LogoButton = ({applicationWallet, sdk}: LogoButtonProps) => {
  const modalService = createModalService<ReactUModalType, ReactUModalProps>();

  return (
    <>
      <ReactUModalContext.Provider value={modalService}>
        <button onClick={() => modalService.showModal('funds')}>
          <img src={logoIcon} alt="U"/>
        </button>
        <UDashboard applicationWallet={applicationWallet} sdk={sdk}/>
      </ReactUModalContext.Provider>
    </>
  );
};
