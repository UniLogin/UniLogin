import React from 'react';
import {IModalService} from '../services/createModalService';

export type ReactUModalType = 'funds' | 'transferAmount' | 'transferRecipient' | 'waitingForTransfer' | 'approveDevice' | 'settings' | 'topup' | 'transfer' | 'none';
export type ReactUModalProps = {

};
export const ReactUModalContext = React.createContext({} as IModalService<ReactUModalType, ReactUModalProps>);


