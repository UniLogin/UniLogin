import React, {useState} from 'react';
import {DeployedWallet, TransferService, TransferErrors} from '@universal-login/sdk';
import {TransferDetails, TokenDetails, DEFAULT_GAS_LIMIT, TokenDetailsWithBalance, GasParameters, getBalanceOf} from '@universal-login/commons';
import '../styles/transfer.sass';
import '../styles/transferDefaults.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {TransferAmount} from './Amount/TransferAmount';
import {TransferRecipient} from './Recipient/TransferRecipient';
import {TransferDropdown} from './Amount/TransferDropdown';

export interface TransferProps {
  transferService: TransferService;
  deployedWallet: DeployedWallet;
  transferDetails: TransferDetails;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  tokenDetails: TokenDetails;
  onSendClick: () => Promise<void>;
  getMaxAmount: () => string;
  transferClassName?: string;
}

export const Transfer = ({transferService, deployedWallet, transferDetails, updateTransferDetailsWith, tokenDetailsWithBalance, tokenDetails, onSendClick, getMaxAmount, transferClassName}: TransferProps) => {
  const [errors, setErrors] = useState<TransferErrors>({amount: [], to: []});

  const balance = getBalanceOf(tokenDetails.symbol, tokenDetailsWithBalance);

  const onTransferClick = async () => {
    setErrors(await transferService.validateInputs(transferDetails, balance));
    if (transferService.areInputsValid()) {
      onSendClick();
    }
  };

  const updateField = (field: string) => (value: string | GasParameters) => {
    updateTransferDetailsWith({[field]: value});
    setErrors({...errors, [field]: []});
  };

  return (
    <div className="universal-login-transfer">
      <div className={getStyleForTopLevelComponent(transferClassName)}>
        <div className="transfer">
          <TransferDropdown
            sdk={deployedWallet.sdk}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            tokenDetails={tokenDetails}
            setToken={(token: TokenDetails) => updateField('transferToken')(token.address)}
            className={transferClassName}
          />
          <TransferAmount
            value={transferDetails.amount}
            tokenSymbol={tokenDetails.symbol}
            errors={errors.amount}
            onChange={updateField('amount')}
            onMaxClick={() => updateField('amount')(getMaxAmount())}
          />
          <TransferRecipient
            onChange={updateField('to')}
            errors={errors.to}
          />
        </div>
        <FooterSection className={transferClassName}>
          <GasPrice
            isDeployed={true}
            deployedWallet={deployedWallet}
            gasLimit={DEFAULT_GAS_LIMIT}
            onGasParametersChanged={(gasParameters: GasParameters) => updateField('gasParameters')(gasParameters)}
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
