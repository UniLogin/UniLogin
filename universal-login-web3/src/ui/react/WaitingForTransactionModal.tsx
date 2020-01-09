import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';
import {useProperty, ModalWrapper, WaitingForTransaction} from '@universal-login/react';
import {UIController} from '../../services/UIController';

export interface WaitForTransactionModalProps {
  uiController: UIController;
  relayerConfig: PublicRelayerConfig;
}
export const WaitForTransactionModal = ({uiController, relayerConfig}: WaitForTransactionModalProps) => {
  const transactionHash: string | undefined = useProperty(uiController.transactionHash);

  return <ModalWrapper>
    <WaitingForTransaction
      action="Waiting for transaction"
      relayerConfig={relayerConfig}
      transactionHash={transactionHash}
    />
  </ModalWrapper>;
};
