import React from 'react';
import {IModalService} from '@universal-login/react';

export type WalletModalType = 'transfer' | 'transferRecipient' | 'request' | 'invitation' | 'topUpAccount' | 'address' | 'personalInfo' | 'cardInfo' | 'waiting' | 'waitingForDeploy' | 'waitingForTransfer' | 'transactionSuccess' | 'safello' | 'none';

export const WalletModalContext = React.createContext({} as IModalService<WalletModalType, void>);
