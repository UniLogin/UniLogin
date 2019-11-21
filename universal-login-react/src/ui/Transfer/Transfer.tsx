import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {TransferDetails, TokenDetails, DEFAULT_GAS_LIMIT, OnGasParametersChanged, isValidAmount, getBalanceOf, TokenDetailsWithBalance, isValidRecipient} from '@universal-login/commons';
import '../styles/transfer.sass';
import '../styles/transferDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {TransferAmount} from './Amount/TransferAmount';
import {TransferRecipient} from './Recipient/TransferRecipient';
import {useAsyncEffect} from '../hooks/useAsyncEffect';

export interface TransferProps {
  deployedWallet: DeployedWallet;
  transferDetails: Partial<TransferDetails>;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetails: TokenDetails;
  onSendClick: () => Promise<void>;
  onGasParametersChanged: OnGasParametersChanged;
  transferAmountClassName?: string;
}

interface ErrorsProps {
  amountError: boolean;
  recipientError: boolean;
}

export const Transfer = ({deployedWallet, transferDetails, updateTransferDetailsWith, tokenDetails, onSendClick, onGasParametersChanged, transferAmountClassName}: TransferProps) => {
  const [errors, setErrors] = useState<ErrorsProps>({amountError: false, recipientError: false});
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);

  const {sdk, contractAddress} = deployedWallet;
  useAsyncEffect(() => sdk.subscribeToBalances(contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(tokenDetails.symbol, tokenDetailsWithBalance);

  const {amount, to, gasParameters} = transferDetails;

  const onClick = () => {
    const errorsCalculated = {
      amountError: !isValidAmount(balance, amount),
      recipientError: !isValidRecipient(to),
    };
    setErrors(errorsCalculated);
    areInputsValid(errorsCalculated) && onSendClick();
  };

  const areInputsValid = (errors: ErrorsProps): boolean => !errors.amountError && !errors.recipientError;

  return (
    <div className="universal-login-amount">
      <div className={getStyleForTopLevelComponent(transferAmountClassName)}>
        <div className="transfer-amount">
          <TransferAmount
            deployedWallet={deployedWallet}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            updateTransferDetailsWith={updateTransferDetailsWith}
            tokenDetails={tokenDetails}
            setAmountError={(isAmountInvalid: boolean) => setErrors({...errors, amountError: isAmountInvalid})}
            amountError={errors.amountError}
            transferAmountClassName={transferAmountClassName}
          />
          <TransferRecipient
            updateTransferDetailsWith={updateTransferDetailsWith}
            recipientError={errors.recipientError}
            setRecipientError={(isRecipientInvalid: boolean) => setErrors({...errors, recipientError: isRecipientInvalid})}
            transferAmountClassName={transferAmountClassName}
          />
        </div>
        <FooterSection className={transferAmountClassName}>
          <GasPrice
            isDeployed={true}
            deployedWallet={deployedWallet}
            gasLimit={DEFAULT_GAS_LIMIT}
            onGasParametersChanged={onGasParametersChanged}
            className={transferAmountClassName}
          />
          <div className="footer-buttons-row">
            <button id="send-button" onClick={onClick} className="footer-approve-btn" disabled={!gasParameters}>Send</button>
          </div>
        </FooterSection>
      </div>
    </div>
  );
};
