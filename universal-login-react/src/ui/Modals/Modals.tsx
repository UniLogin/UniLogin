import React, {useContext} from 'react';
import {ModalWrapper} from './ModalWrapper';
import {WaitingFor} from '../commons/WaitingFor';
import {ReactModalContext, TopUpProps} from '../../core/models/ReactModalContext';
import {TopUp} from '../TopUp/TopUp';
import {useAsync} from '../hooks/useAsync';
import {useServices} from '../../core/services/useServices';

export interface ModalsProps {
  modalClassName?: string;
}

const Modals = ({modalClassName}: ModalsProps) => {
  const modalService = useContext(ReactModalContext);
  const {sdk} = useServices();
  const [relayerConfig] = useAsync(async () => sdk.getRelayerConfig(), []);

  switch (modalService.modalName) {
    case 'topUpAccount':
      return (
        <TopUp
          hideModal={modalService.hideModal}
          modalClassName={modalClassName}
          {...modalService.modalProps as TopUpProps}
          isModal
        />
      );
    case 'waitingForDeploy':
      return (
        <ModalWrapper modalPosition="center">
          {relayerConfig ?
            <WaitingFor {...modalService.modalProps} action={'Wallet creation'} chainName={relayerConfig!.chainSpec.name} transactionHash={'0xee9270ccdeb9fcb92b3ec509ba11ba2362ab32ba8f...'}/> :
            '...'}
        </ModalWrapper>
      );
    case 'topUp':
      return (
        <ModalWrapper modalPosition="center">
          {relayerConfig ?
            <WaitingFor {...modalService.modalProps} action={'Top up'} chainName={relayerConfig!.chainSpec.name} transactionHash={'0xee9270ccdeb9fcb92b3ec509ba11ba2362ab32ba8f...'}/> :
            '...'}
        </ModalWrapper>
      );
    default:
      return null;
  }
};

export default Modals;
