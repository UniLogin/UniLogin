import {WalletService} from '@universal-login/sdk';
import {IModalService} from '@universal-login/react';
import {WalletModalType, WalletModalPropType} from '../entities/WalletModalContext';

export const hideTopUpModal = (walletService: WalletService, modalService: IModalService<WalletModalType, WalletModalPropType>) => {
  walletService.disconnect();
  modalService.hideModal();
};
