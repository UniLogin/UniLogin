import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';
import {ExplorerLink} from './ExplorerLink';
import {WaitingFor, WaitingForProps} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {ButtonLink} from './Button/ButtonLink';
import UnicornGif from '../assets/gifs/unicorn.gif';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  info?: string;
}

const Body = ({action, relayerConfig, transactionHash, className, info}: WaitingForTransactionProps) => (
  <div>
    <WaitingFor
      action={action}
      className={className}
    />
    <div className="modal-pending-section">
      <ButtonLink text='See pending transaction' onClick={() => console.log()}/>
      <ExplorerLink
        chainName={relayerConfig.chainSpec.name}
        transactionHash={transactionHash}
      />
    </div>
    <img src={UnicornGif} alt="Unicorn gif"/>
    {info && <p className="info-text">{info}</p>}
  </div>
);

export const WaitingForTransaction = (props: WaitingForTransactionProps) => (
  <div className="universal-login-waiting-for-transaction">
    <div className={getStyleForTopLevelComponent(props.className)}>
      <Body {...props} />
    </div>
  </div>
);

export const WaitingForDeployment = (props: WaitingForTransactionProps) => (
  <WaitingForTransaction
    {...props}
    action={props.action || 'Wallet creation'}
    info={props.info || DEPLOYMENT_INFO}
  />
);

const DEPLOYMENT_INFO = 'It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it...';
