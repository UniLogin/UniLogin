import React from 'react'
import {Property} from 'reactive-properties'
import {WalletService} from '@universal-login/sdk'
import {MemoryRouter} from 'react-router-dom'
import {DashboardModal} from './DashboardModal'
import {getWindowConfirmation} from '../../core/utils/getWindowConfirmation'
import {useProperty} from '../hooks/useProperty'

export interface ManualDashboardProps {
  walletService: WalletService
  isVisible: Property<boolean>
  onClose: () => void
}

export const ManualDashboard = ({ walletService, isVisible, onClose }: ManualDashboardProps) => (
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
)
