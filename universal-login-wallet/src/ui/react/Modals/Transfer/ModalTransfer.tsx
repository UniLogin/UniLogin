import {join} from 'path';
import React, {useState} from 'react';
import {useHistory, Switch} from 'react-router';
import {Route} from 'react-router-dom';
import {TransferDetails, ETHER_NATIVE_TOKEN, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import {TransferService} from '@universal-login/sdk';
import {ModalTransfer as Transfer, WaitingForTransaction, useAsyncEffect, ErrorMessage} from '@universal-login/react';
import {useServices} from '../../../hooks';
import ModalWrapperClosable from '../ModalWrapperClosable';

export interface ModalTransferProps {
  basePath?: string;
}

const ModalTransfer = ({basePath = ''}: ModalTransferProps) => {
  const history = useHistory();

  const [transferDetails, setTransferDetails] = useState(
    {transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails,
  );
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  const {walletService} = useServices();
  const deployedWallet = walletService.getDeployedWallet();
  const selectedToken = deployedWallet.sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken);

  useAsyncEffect(() => deployedWallet.sdk.subscribeToBalances(deployedWallet.contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(selectedToken.symbol, tokenDetailsWithBalance);

  const transferService = new TransferService(deployedWallet);
  const onGenerateClick = async () => {
    transferService.validateInputs(transferDetails, balance);
    history.push(join(basePath, 'waiting'));
    try {
      const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(transferDetails);
      const {transactionHash} = await waitForTransactionHash();
      history.replace(join(basePath, 'waiting'), {transactionHash});
      await waitToBeSuccess();
      history.replace('/wallet');
    } catch (e) {
      history.replace(join(basePath, 'error'), {error: `${e.name}: ${e.message}`});
    }
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <ModalWrapperClosable hideModal={() => history.push('/wallet')}>
          <Transfer
            deployedWallet={deployedWallet}
            transferDetails={transferDetails}
            updateTransferDetailsWith={updateTransferDetailsWith}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            tokenDetails={selectedToken}
            onSendClick={onGenerateClick}
            getEtherMaxAmount={() => transferService.getEtherMaxAmount(transferDetails.gasParameters, balance)}
            transferClassName="jarvis-styles"
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
            relayerConfig={walletService.sdk.relayerConfig!}
            className="jarvis-styles"
          />
        }
      />
      <Route
        exact
        path={join(basePath, 'error')}
        render={({location, history}) =>
          <ModalWrapperClosable hideModal={() => history.replace('/wallet')}>
            <ErrorMessage
              className="jarvis-styles"
              message={location.state.error}
            />
          </ModalWrapperClosable>}
      />
    </Switch>
  );
};

export default ModalTransfer;
