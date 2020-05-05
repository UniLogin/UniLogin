import React from 'react';
import {PublicRelayerConfig} from '@unilogin/commons';
import {ExplorerLink} from './ExplorerLink';
import {WaitingFor, WaitingForProps} from './WaitingFor';
import {useClassFor, classForComponent} from '../utils/classFor';
import {CompanyLogo} from './CompanyLogo';
import '../styles/base/waitingForTransaction.sass';
import '../styles/themes/Legacy/waitingForTransactionThemeLegacy.sass';
import '../styles/themes/Jarvis/waitingForTransactionThemeJarvis.sass';
import '../styles/themes/UniLogin/waitingForTransactionThemeUniLogin.sass';
import {InfoText} from './Text/InfoText';

export interface WaitingForTransactionProps extends WaitingForProps {
  relayerConfig: PublicRelayerConfig;
  transactionHash?: string;
  info?: string;
}

const Body = ({action, description, relayerConfig, transactionHash, info}: WaitingForTransactionProps) => (
  <div>
    <WaitingFor
      action={action}
      description={description}
    />
    <div className={classForComponent('waitingfortransaction-modal-pending-section')}>
      <h3 className={classForComponent('waitingfortransaction-transaction-hash-title')}>Transaction hash</h3>
      <ExplorerLink
        chainName={relayerConfig.network}
        transactionHash={transactionHash}
      />
      <div className={classForComponent('waitingfortransaction-pending-img')}></div>
    </div>
    {info && <InfoText>{info}</InfoText>}
  </div>
);

export const WaitingForTransaction = (props: WaitingForTransactionProps) => (
  <div className={useClassFor('waitingfortransaction')}>
    <CompanyLogo />
    <Body description={TRANSACTION_DESCRIPTION} {...props} />
  </div>
);

export const WaitingForDeployment = (props: WaitingForTransactionProps) => (
  <WaitingForTransaction
    {...props}
    action={props.action || 'Wallet creation'}
    description={props.description || DEPLOYMENT_DESCRIPTION}
    info={props.info || DEPLOYMENT_DESCRIPTION}
  />
);

export const DEPLOYMENT_DESCRIPTION = 'It takes time to register your username and deploy your wallet. In order to do so, we need to create a transaction and wait until the Ethereum blockchain validates it.';
export const TRANSACTION_DESCRIPTION = 'We have created a transaction. Please wait until the Ethereum validates it.';
