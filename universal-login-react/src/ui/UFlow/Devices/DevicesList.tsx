import React, {useState} from 'react';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import './../../styles/base/devices.sass';
import './../../styles/themes/Legacy/devicesThemeLegacy.sass';
import './../../styles/themes/UniLogin/devicesThemeUniLogin.sass';
import './../../styles/themes/Jarvis/devicesThemeJarvis.sass';
import {NewDeviceMessage} from './NewDeviceMessage';
import {ConnectedDevices} from './ConnectedDevices';
import {useAsync} from '../../hooks/useAsync';
import Spinner from '../../commons/Spinner';
import {useHistory} from 'react-router';
import {join} from 'path';
import {ThemedComponent} from '../../commons/ThemedComponent';
import {GasPrice} from '../../commons/GasPrice';
import {DEFAULT_GAS_LIMIT, ensureNotFalsy, GasParameters} from '@unilogin/commons';
import {FooterSection} from '../../commons/FooterSection';
import {MissingParameter} from '../../../core/utils/errors';

export interface DevicesListProps {
  deployedWallet: DeployedWithoutEmailWallet;
  devicesBasePath: string;
}

export const DevicesList = ({deployedWallet, devicesBasePath}: DevicesListProps) => {
  const [devices] = useAsync(async () => deployedWallet.getConnectedDevices(), []);
  const [gasParameters, setGasParameters] = useState<GasParameters | undefined>(undefined);
  const [deviceToRemove, setDeviceToRemove] = useState<string | undefined>(undefined);

  const history = useHistory();

  const onDeleteDevice = async () => {
    ensureNotFalsy(gasParameters, MissingParameter, 'gas parameters');
    ensureNotFalsy(deviceToRemove, MissingParameter, 'device to remove');
    history.replace(join(devicesBasePath, '/waitingForRemovingDevice'));
    const {waitToBeSuccess, waitForTransactionHash} = await deployedWallet.removeKey(deviceToRemove, gasParameters);
    const {transactionHash} = await waitForTransactionHash();
    ensureNotFalsy(transactionHash, TypeError);
    history.replace(join(devicesBasePath, '/waitingForRemovingDevice'), {transactionHash});
    await waitToBeSuccess();
    history.replace(devicesBasePath);
  };

  return (<>
    <ThemedComponent name="devices">
      <NewDeviceMessage
        deployedWallet={deployedWallet}
        onManageClick={() => history.push(join(devicesBasePath, 'approveDevice'))}
      />
      <div className="devices-inner">
        {devices
          ? <ConnectedDevices
            devicesList={devices}
            deployedWallet={deployedWallet}
            setDeviceToRemove={setDeviceToRemove}
          />
          : <Spinner className="spinner-center"/>}
      </div>
      <button onClick={() => history.push(join(devicesBasePath, 'disconnectAccount'))} className="disconnect-account-link">Disconnect this device</button>
    </ThemedComponent>
    {deviceToRemove && <FooterSection>
      <GasPrice
        isDeployed
        deployedWallet={deployedWallet}
        sdk={deployedWallet.sdk}
        onGasParametersChanged={setGasParameters}
        gasLimit={DEFAULT_GAS_LIMIT}
      />
      <div className="footer-buttons-row one">
        <button id="send-button" onClick={onDeleteDevice} className="footer-approve-btn" disabled={!gasParameters}>Confirm delete</button>
      </div>
    </FooterSection>}
  </>);
};
