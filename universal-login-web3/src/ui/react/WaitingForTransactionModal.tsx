import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';
import {ModalWrapper, WaitingForTransaction} from '@universal-login/react';

export interface WaitForTransactionModalProps {
  transactionHash?: string;
  relayerConfig: PublicRelayerConfig;
}
export const WaitForTransactionModal = ({transactionHash, relayerConfig}: WaitForTransactionModalProps) =>
  <ModalWrapper>
    <WaitingForTransaction
      action="Waiting for transaction"
      relayerConfig={relayerConfig}
      transactionHash={transactionHash}
    />
  </ModalWrapper>;
