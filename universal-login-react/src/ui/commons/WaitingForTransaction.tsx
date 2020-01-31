import React from 'react';
import {PublicRelayerConfig} from '@universal-login/commons';
import {ExplorerLink} from './ExplorerLink';
import {WaitingFor, WaitingForProps} from './WaitingFor';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {useClassFor, classForComponent} from '../utils/classFor';
import {ButtonClose} from './Button/ButtonClose';
import {CompanyLogo} from './CompanyLogo';
import '../styles/base/waitingForTransaction.sass';
import '../styles/themes/Legacy/waitingForTransactionThemeLegacy.sass';
import '../styles/themes/Jarvis/waitingForTransactionThemeJarvis.sass';
import '../styles/themes/UniLogin/waitingForTransactionThemeUniLogin.sass';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  info?: string;
}

const Body = ({action, description, relayerConfig, transactionHash, className, info}: WaitingForTransactionProps) => (
  <div>
    <WaitingFor
      action={action}
      className={className}
      description={description}
    />
    <div className={classForComponent('waitingfortransaction-modal-pending-section')}>
      <h3 className={classForComponent('waitingfortransaction-transaction-hash-title')}>Transaction hash</h3>
      <ExplorerLink
        chainName={relayerConfig.chainSpec.name}
        transactionHash={transactionHash}
      />
      <div className={classForComponent('waitingfortransaction-pending-img')}></div>
    </div>
    {info && <p className={classForComponent('info-text')}>{info}</p>}
  </div>
);

export const WaitingForTransaction = (props: WaitingForTransactionProps) => (
  <div className={useClassFor('waitingfortransaction')}>
    <CompanyLogo />
    <ButtonClose onClick={() => console.log('hide modal')}/>
    <div className={getStyleForTopLevelComponent(props.className)}>
      <Body {...props}
        description={props.description || 'It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it.'}
      />
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
