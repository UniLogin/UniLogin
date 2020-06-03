import React, {useState} from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';
import {join} from 'path';
import {DeployedWallet, WalletService} from '@unilogin/sdk';
import {ConnectWithEmoji} from '../../ConnectionFlow/ConnectWithEmoji';
import {GasPrice} from '../../commons/GasPrice';
import {DEFAULT_GAS_LIMIT, GasParameters, ensureNotFalsy} from '@unilogin/commons';

export interface ConnectManuallyProps {
  walletService: WalletService;
  onConnect: () => void;
  devicesBasePath: string;
  basePath?: string;
}

export const ConnectManually = ({basePath = '', onConnect, devicesBasePath, walletService}: ConnectManuallyProps) => {
  const [address, setAddress] = useState('');
  const history = useHistory();
  const deployedWallet = walletService.getDeployedWallet();
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);


  const onConnectClick = async () => {
    try {
      ensureNotFalsy(gasParameters, TypeError);
      ensureNotFalsy(address, Error, 'Invalid key');
      history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash: undefined});
      const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.addKey(address, gasParameters);
      const {transactionHash} = await waitForTransactionHash();
      ensureNotFalsy(transactionHash, TypeError);
      history.replace(join(devicesBasePath, 'waitingForConnection'), {transactionHash});
      await waitToBeSuccess();
      history.replace(join(devicesBasePath, 'connectionSuccess'));
    } catch (e) {
      console.error(e);
      history.replace(join(devicesBasePath, 'connectionFailed'), {error: e.message});
    }
  };

  return (
    <Switch>
      <Route path={`${basePath}/`} exact>
        <div>
          Connect Manually
          <br />
          Address:
          <input
            onChange={event => setAddress(event.target.value)}
            value={address}
          />
          <br />
          <button onClick={onConnectClick} > Connect </button>
          <GasPrice
            isDeployed
            deployedWallet={deployedWallet}
            sdk={deployedWallet.sdk}
            onGasParametersChanged={setGasParameters}
            gasLimit={DEFAULT_GAS_LIMIT}
          />
        </div>
      </Route>
      {/* <Route path={join(basePath, 'request')} exact>
        <ConnectWithEmoji walletService={walletService} onCancel={() => history.replace(basePath)} onConnect={onConnect} />
      </Route> */}
    </Switch>);
}
