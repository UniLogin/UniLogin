import React from 'react';
import {OnGasParametersChanged} from '@universal-login/commons';
import {IModalService} from '../services/createModalService';
import UniversalLoginSDK from '@universal-login/sdk';
import {OnboardingWalletService} from '../../ui/Onboarding/Onboarding';

export type ReactModalType = 'connectionFlow' | 'topUpAccount' | 'topUp' | 'address' | 'waitingForDeploy' | 'waitingForTransfer' | 'safello';

export type ReactModalProps = TopUpProps | ConnectionFlowProps;

export type ConnectionFlowProps = {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: OnboardingWalletService;
  onSuccess: () => void;
};

export type TopUpProps = {
  sdk: UniversalLoginSDK
  contractAddress: string;
  onGasParametersChanged: OnGasParametersChanged;
};

export const ReactModalContext = React.createContext({} as IModalService<ReactModalType, ReactModalProps>);
