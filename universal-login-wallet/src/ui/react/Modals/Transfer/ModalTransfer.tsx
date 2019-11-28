import React, {useState, useContext} from 'react';
import {TransferService} from '@universal-login/sdk';
import {TransferDetails, ETHER_NATIVE_TOKEN, TokenDetailsWithBalance, getBalanceOf} from '@universal-login/commons';
import {ModalTransfer as Transfer, useAsyncEffect} from '@universal-login/react';
import {WalletModalContext} from '../../../../core/entities/WalletModalContext';
import {useServices} from '../../../hooks';

const ModalTransfer = () => {
  const [transferDetails, setTransferDetails] = useState(
    {transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails,
  );
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  const {walletService} = useServices();
  const deployedWallet = walletService.getDeployedWallet();
  const selectedToken = deployedWallet.sdk.tokensDetailsStore.getTokenByAddress(transferDetails.transferToken);

  useAsyncEffect(() => deployedWallet.sdk.subscribeToBalances(deployedWallet.contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(selectedToken.symbol, tokenDetailsWithBalance);

  const transferService = new TransferService(deployedWallet);
  const modalService = useContext(WalletModalContext);
  const onGenerateClick = async () => {
    transferService.validateInputs(transferDetails, balance);
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

  return (
    <Transfer
      deployedWallet={deployedWallet}
      transferDetails={transferDetails}
      updateTransferDetailsWith={updateTransferDetailsWith}
      tokenDetailsWithBalance={tokenDetailsWithBalance}
      tokenDetails={selectedToken}
      onSendClick={onGenerateClick}
      transferClassName="jarvis-styles"
    />
  );
};

export default ModalTransfer;
