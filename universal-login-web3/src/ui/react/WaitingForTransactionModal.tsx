import React from 'react';
import {PublicRelayerConfig} from '@unilogin/commons';
import {ModalWrapper, WaitingForTransaction} from '@unilogin/react';

export interface WaitForTransactionModalProps {
  transactionHash?: string;
  relayerConfig: PublicRelayerConfig;
  onClose: () => void;
}

export const WaitForTransactionModal = ({transactionHash, relayerConfig, onClose}: WaitForTransactionModalProps) =>
  <ModalWrapper hideModal={onClose}>
    <WaitingForTransaction
      action="Waiting for transaction"
      relayerConfig={relayerConfig}
      transactionHash={transactionHash}
    />
  </ModalWrapper>;
