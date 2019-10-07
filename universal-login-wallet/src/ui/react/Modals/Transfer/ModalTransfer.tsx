import React, {useState, useContext} from 'react';
import {TransferService} from '@universal-login/sdk';
import {TransferDetails, GasParameters, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {ModalTransferRecipient, ModalTransferAmount} from '@universal-login/react';
import {WalletModalContext} from '../../../../core/entities/WalletModalContext';
import {useServices} from '../../../hooks';

const ModalTransfer = () => {
  const modalService = useContext(WalletModalContext);
  const [modal, setModal] = useState('transferAmount');

  const {walletService, sdk} = useServices();
  const [transferDetails, setTransferDetails] = useState({transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails);
  const selectedToken = sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken);
  const deployedWallet = walletService.getDeployedWallet();

  const transferService = new TransferService(deployedWallet);
  const onGenerateClick = async () => {
    modalService.showModal('waitingForTransfer');
    try {
      const {waitToBeSuccess, waitForTransactionHash} = await transferService.transfer(transferDetails);
      const {transactionHash} = await waitForTransactionHash();
      modalService.showModal('waitingForTransfer', {transactionHash});
      await waitToBeSuccess();
      modalService.hideModal();
    } catch (e) {
      modalService.showModal('error', `${e.name}: ${e.message}`);
    }
  };

  const updateTransferDetailsWith = (args: Partial<TransferDetails>) => {
    setTransferDetails({...transferDetails, ...args});
  };

  if (modal === 'transferAmount') {
    return (
      <ModalTransferAmount
        deployedWallet={deployedWallet}
        onSelectRecipientClick={() => setModal('transferRecipient')}
        updateTransferDetailsWith={updateTransferDetailsWith}
        tokenDetails={selectedToken}
        transferAmountClassName="jarvis-transfer-amount"
      />
    );
  } else if (modal === 'transferRecipient') {
    return (
      <div>
        <ModalTransferRecipient
          symbol={selectedToken.symbol}
          onRecipientChange={event => updateTransferDetailsWith({to: event.target.value})}
          onSendClick={onGenerateClick}
          onBackClick={() => setModal('transferAmount')}
          transferDetails={transferDetails}
          className="jarvis-styles"
          deployedWallet={walletService.getDeployedWallet()}
          onGasParametersChanged={(gasParameters: GasParameters) => updateTransferDetailsWith({gasParameters})}
        />
      </div>
    );
  }
  return null;
};

export default ModalTransfer;
