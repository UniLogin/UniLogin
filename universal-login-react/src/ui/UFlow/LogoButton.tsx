import React from 'react';
import logoIcon from '../assets/icons/U.svg';
import {createModalService} from '../../core/services/createModalService';
import {UDashboard} from '../Modals/UDashboard';
import {ReactUModalType, ReactUModalProps, ReactUModalContext} from '../../core/models/ReactUModalContext';
import UniversalLoginSDK from '@universal-login/sdk';
import {ApplicationWallet} from '@universal-login/commons';

export interface LogoButtonProps {
  sdk: UniversalLoginSDK;
  applicationWallet: ApplicationWallet;
}

export const LogoButton = ({sdk, applicationWallet}: LogoButtonProps) => {
  const modalService = createModalService<ReactUModalType, ReactUModalProps>();


  return (
    <>
      <ReactUModalContext.Provider value={modalService}>
        <button onClick={() => modalService.showModal('funds')}>
          <img src={logoIcon} alt="U"/>
        </button>
        <UDashboard
          sdk={sdk}
          applicationWallet={applicationWallet}
        />
      </ReactUModalContext.Provider>
    </>
  );
