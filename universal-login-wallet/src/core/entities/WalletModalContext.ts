import React from 'react';
import {IModalService} from '@universal-login/react/dist/src/core/services/createModalService';

export type ModalStateType = 'transfer' | 'request' | 'invitation' | 'topUpAccount' | 'address' | 'personalInfo' | 'cardInfo' | 'waiting' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export const WalletModalContext = React.createContext({} as IModalService<ModalStateType>);
