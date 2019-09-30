import {WalletService} from '@universal-login/sdk';
import {IModalService} from '@universal-login/react';
import {WalletModalType} from '../entities/WalletModalContext';

export const hideTopUpModal = (walletService: WalletService, modalService: IModalService<WalletModalType, string>) => {
  walletService.disconnect();
  modalService.hideModal();
};
