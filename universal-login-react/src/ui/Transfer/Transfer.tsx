import React, {useState} from 'react';
import {DeployedWallet} from '@universal-login/sdk';
import {TransferDetails, TokenDetails, DEFAULT_GAS_LIMIT, TokenDetailsWithBalance, GasParameters} from '@universal-login/commons';
import '../styles/transfer.sass';
import '../styles/transferDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {TransferAmount} from './Amount/TransferAmount';
import {TransferRecipient} from './Recipient/TransferRecipient';
import {TransferDropdown} from './Amount/TransferDropdown';

export interface TransferProps {
  deployedWallet: DeployedWallet;
  transferDetails: TransferDetails;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  tokenDetails: TokenDetails;
  onSendClick: () => Promise<void>;
  getEtherMaxAmount: () => string;
  transferClassName?: string;
}

interface ErrorsProps {
  amount: string[];
  recipient: boolean;
}

export const Transfer = ({deployedWallet, transferDetails, updateTransferDetailsWith, tokenDetailsWithBalance, tokenDetails, onSendClick, getEtherMaxAmount, transferClassName}: TransferProps) => {
  const [errors, setErrors] = useState<ErrorsProps>({amount: [], recipient: false});

  const onTransferClick = async () => {
    try {
      await onSendClick();
    } catch (error) {
      setErrors({
        amount: error.errorType !== 'InvalidAddressOrEnsName' ? ['Invalid amount'] : [],
        recipient: error.errorType !== 'InvalidAmount' && true,
      });
    }
  };

  const updateAmount = (amount: string) => {
    updateTransferDetailsWith({amount});
    setErrors({...errors, amount: []});
  };

  return (
    <div className="universal-login-transfer">
      <div className={getStyleForTopLevelComponent(transferClassName)}>
        <div className="transfer">
          <TransferDropdown
            sdk={deployedWallet.sdk}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            tokenDetails={tokenDetails}
            setToken={(token: TokenDetails) => updateTransferDetailsWith({transferToken: token.address})}
            className={transferClassName}
          />
          <TransferAmount
            value={transferDetails.amount}
            tokenSymbol={tokenDetails.symbol}
            errors={errors.amount}
            onChange={updateAmount}
            onMaxClick={() => updateAmount(getEtherMaxAmount())}
          />
          <TransferRecipient
            updateTransferDetailsWith={updateTransferDetailsWith}
            recipientError={errors.recipient}
            setRecipientError={(isRecipientInvalid: boolean) => setErrors({...errors, recipient: isRecipientInvalid})}
          />
        </div>
        <FooterSection className={transferClassName}>
          <GasPrice
            isDeployed={true}
            deployedWallet={deployedWallet}
            gasLimit={DEFAULT_GAS_LIMIT}
            onGasParametersChanged={(gasParameters: GasParameters) => updateTransferDetailsWith({gasParameters})}
            className={transferClassName}
          />
          <div className="footer-buttons-row">
            <button id="send-button" onClick={onTransferClick} className="footer-approve-btn" disabled={!transferDetails.gasParameters}>Send</button>
          </div>
        </FooterSection>
      </div>
    </div>
  );
};
