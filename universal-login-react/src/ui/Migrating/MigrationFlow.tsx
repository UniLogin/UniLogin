import React from 'react';
import {WalletService} from '@unilogin/sdk';
import {EnterEmail} from './EnterEmail';
import {CreatePassword} from '../Onboarding/CreatePassword';
import {ConfirmCodeScreen} from '../Onboarding/ConfirmCodeScreen';
import {UnexpectedWalletState} from '../../core/utils/errors';

export interface MigrationFlowProps {
  walletService: WalletService;
  hideModal: () => void;
};

export const MigrationFlow = ({walletService, hideModal}: MigrationFlowProps) => {
  switch (walletService.state.kind) {
    case 'DeployedWithoutEmail':
      return <EnterEmail
        onConfirm={(email) => walletService.createRequestedMigratingWallet(email)}
        hideModal={hideModal}
        walletService={walletService}
      />;
    case 'RequestedMigrating':
      return <ConfirmCodeScreen
        onCancel={() => walletService.migrationRollback()}
        walletService={walletService}
      />;
    case 'ConfirmedMigrating':
      return <CreatePassword
        walletService={walletService}
        hideModal={hideModal}
        onConfirm={(password) => walletService.createPassword(password)}
      />;
    case 'Deployed':
      return <div>Success</div>;
    default:
      throw new UnexpectedWalletState(walletService.state.kind);
  }
};
