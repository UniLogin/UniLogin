import {useLocation} from 'react-router';
import {WaitingForTransaction} from '../../..';
import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';

export interface WaitingForConnectionProps {
  relayerConfig: PublicRelayerConfig;
  className?: string;
}

export function WaitingForConnection({relayerConfig, className}: WaitingForConnectionProps) {
  const location = useLocation();
  const {transactionHash} = location.state;

  return (
    <WaitingForTransaction
      action="Connecting device"
      relayerConfig={relayerConfig}
      transactionHash={transactionHash}
      className={className}
    />
  );
}
