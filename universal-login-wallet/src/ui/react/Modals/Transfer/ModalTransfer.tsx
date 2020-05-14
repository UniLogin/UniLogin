import {join} from 'path';
import React from 'react';
import {useHistory, Switch} from 'react-router';
import {Route} from 'react-router-dom';
import {TransferService, Execution} from '@unilogin/sdk';
import {ModalTransfer as Transfer, WaitingForTransaction, ErrorMessage} from '@unilogin/react';
import {useServices} from '../../../hooks';
import ModalWrapperClosable from '../ModalWrapperClosable';

export interface ModalTransferProps {
  basePath?: string;
}

const ModalTransfer = ({basePath = ''}: ModalTransferProps) => {
  const history = useHistory();
  const {walletService} = useServices();

  const deployedWallet = walletService.getDeployedWallet();

  const transferService = new TransferService(deployedWallet);

  const onTransferTriggered = async (transfer: () => Promise<Execution>) => {
    history.push(join(basePath, 'waiting'));
    try {
      const {waitToBeSuccess, waitForTransactionHash} = await transfer();
      const {transactionHash} = await waitForTransactionHash();
      history.replace(join(basePath, 'waiting'), {transactionHash});
      await waitToBeSuccess();
      history.replace('/dashboard');
    } catch (e) {
      history.replace(join(basePath, 'error'), {error: `${e.name}: ${e.message}`});
    }
  };

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <ModalWrapperClosable hideModal={() => history.push('/dashboard')}>
          <Transfer
            transferService={transferService}
            onTransferTriggered={onTransferTriggered}
            sdk={deployedWallet.sdk}
          />
        </ModalWrapperClosable>
      </Route>
      <Route
        exact
        path={join(basePath, 'waiting')}
        render={({location}) =>
          <WaitingForTransaction
            transactionHash={location.state?.transactionHash}
            action={'Transferring funds'}
            relayerConfig={walletService.sdk.getRelayerConfig()}
          />
        }
      />
      <Route
        exact
        path={join(basePath, 'error')}
        render={({location, history}) =>
          <ModalWrapperClosable hideModal={() => history.replace('/dashboard')}>
            <ErrorMessage
              message={location.state.error}
            />
          </ModalWrapperClosable>}
      />
    </Switch>
  );
};

export default ModalTransfer;
