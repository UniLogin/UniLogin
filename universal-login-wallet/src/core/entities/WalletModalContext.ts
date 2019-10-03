import React from 'react';
import {IModalService} from '@universal-login/react';
import {ModalWaitingForProps} from '../../ui/react/Modals/ModalWaitingFor';
import {OnGasParametersChanged} from '@universal-login/commons';

export type WalletModalType = 'error' | 'transfer' | 'transferRecipient' | 'request' | 'topUpAccount' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export interface TopUpModalProps {
  onGasParametersChanged: OnGasParametersChanged;
}

export type WalletModalPropType = Partial<ModalWaitingForProps> | TopUpModalProps;

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, WalletModalPropType>);
