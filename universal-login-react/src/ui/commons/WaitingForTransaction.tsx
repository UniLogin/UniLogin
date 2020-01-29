import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';
import {ExplorerLink} from './ExplorerLink';
import {WaitingFor, WaitingForProps} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {useThemeClassFor} from '../utils/classFor';
import '../styles/base/waitingForTransaction.sass';
import '../styles/themes/Legacy/waitingForTransactionThemeLegacy.sass';

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
    <div className={`unilogin-component-waitingfortransaction-modal-pending-section ${useThemeClassFor()}`}>
      <h3 className={`unilogin-component-waitingfortransaction-transaction-hash-title ${useThemeClassFor()}`}>Transaction hash</h3>
      <ExplorerLink
        chainName={relayerConfig.chainSpec.name}
        transactionHash={transactionHash}
      />
    </div>
    <div className={`${useThemeClassFor()}`}>
      {info && <p className="info-text">{info}</p>}
    </div>
  </div>
);

export const WaitingForTransaction = (props: WaitingForTransactionProps) => (
  <div className={`unilogin-component-waitinfortransaction ${useThemeClassFor()}`}>
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
