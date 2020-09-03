import React, {useMemo, useState} from 'react';
import {MemoryRouter} from 'react-router';
import {DeployedWallet, WalletService} from '@unilogin/sdk';
import logoIcon from '../assets/icons/U.svg';
import {useProperty} from '../..';
import {DashboardModal} from './DashboardModal';
import {getWindowConfirmation} from '../../core/utils/getWindowConfirmation';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import './../styles/base/udashboard.sass';
import './../styles/themes/UniLogin/udashboardThemeUniLogin.sass';
import './../styles/themes/Legacy/udashboardThemeLegacy.sass';

export interface DashboardProps {
  deployedWallet?: DeployedWallet;
  walletService?: WalletService;
}

export const Dashboard = (props: DashboardProps) => {
  const walletService = useMemo(
    () => initializeWalletService(props.walletService, props.deployedWallet),
    [props.deployedWallet, props.walletService],
  );
  const [dashboardVisibility, setDashboardVisibility] = useState(false);

  const state = useProperty(walletService.stateProperty);
  const deployedWallet = walletService.isDeployed(state) ? state.wallet : undefined;

  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);
  useAsyncEffect(async () => deployedWallet?.subscribeAuthorisations(setNewNotifications) as Promise<() => void>, [deployedWallet]);

  useAsyncEffect(async () => deployedWallet?.subscribeDisconnected(() => walletService.disconnect()), [deployedWallet]);

  if (!deployedWallet) {
    return null;
  }

  return (
    <>
      <button
        className={`udashboard-logo-btn ${newNotifications.length > 0 ? 'new-notifications' : ''}`}
        onClick={() => setDashboardVisibility(true)}
      >
        <img src={logoIcon} alt="U" />
      </button>

      <MemoryRouter initialEntries={['/dashboard/funds']} getUserConfirmation={getWindowConfirmation}>
        {dashboardVisibility && (
          <DashboardModal
            walletService={walletService}
            onClose={() => setDashboardVisibility(false)}
          />
        )}
      </MemoryRouter>
    </>
  );
};

function initializeWalletService(walletService?: WalletService, deployedWallet?: DeployedWallet) {
  if (walletService) {
    return walletService;
  }

  if (!deployedWallet) {
    throw new TypeError('Either WalletService or DeployedWallet must be provided');
  }

  const newWalletService = new WalletService(deployedWallet.sdk);
  newWalletService.setWallet(deployedWallet.asSerializedDeployedWallet);
  return newWalletService;
}
