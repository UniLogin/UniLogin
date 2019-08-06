import React from 'react';
import {OnRampConfig} from '@universal-login/commons';
import {IModalService} from '../services/createModalService';

export type ReactModalType = 'topUpAccount' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello';

export type ReactModalProps = TopUpProps;

export type TopUpProps = {
  contractAddress: string;
  onRampConfig: OnRampConfig;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);
