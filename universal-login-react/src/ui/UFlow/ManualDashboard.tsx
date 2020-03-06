import React from 'react';
import {Property} from 'reactive-properties';
import {WalletService} from '@unilogin/sdk';
import {MemoryRouter} from 'react-router-dom';
import {DashboardModal} from './DashboardModal';
import {getWindowConfirmation} from '../../core/utils/getWindowConfirmation';
import {useProperty} from '../hooks/useProperty';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface ManualDashboardProps {
  walletService: WalletService;
  isVisible: Property<boolean>;
  onClose: () => void;
  className?: string;
}

export const ManualDashboard = ({walletService, isVisible, onClose, className}: ManualDashboardProps) => {
  useAsyncEffect(async () => walletService.getDeployedWallet().subscribeDisconnected(() => walletService.disconnect()), []);

  return (
    <div className={getStyleForTopLevelComponent(className)}>
      <MemoryRouter
        initialEntries={['/dashboard/funds']}
        getUserConfirmation={getWindowConfirmation}
      >
        {useProperty(isVisible) && (
          <DashboardModal
            walletService={walletService}
            onClose={onClose}
          />
        )}
      </MemoryRouter>
    </div>
  );
}
