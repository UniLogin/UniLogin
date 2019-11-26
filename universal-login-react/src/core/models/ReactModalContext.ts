import React from 'react';
import {OnGasParametersChanged} from '@universal-login/commons';
import {IModalService, ShowModal} from '../services/useModalService';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';

export type ReactModalType =
  | 'connectionFlow'
  | 'topUpAccount'
  | 'topUp'
  | 'address'
  | 'safello';

export type ReactModalProps = TopUpProps | ConnectionFlowProps;

export type ConnectionFlowProps = {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onSuccess: () => void;
};

export type TopUpProps = {
  sdk: UniversalLoginSDK;
  contractAddress: string;
  onGasParametersChanged?: OnGasParametersChanged;
  isDeployment: boolean;
  hideModal?: () => void;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);

export type ShowReactModal = ShowModal<ReactModalType, ReactModalProps>;
