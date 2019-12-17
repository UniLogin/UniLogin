import React, {useState} from 'react';
import {TransferService, TransferErrors, Execution} from '@universal-login/sdk';
import {TransferDetails, TokenDetails, DEFAULT_GAS_LIMIT, TokenDetailsWithBalance, GasParameters, getBalanceOf, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
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
  tokenDetailsWithBalance: TokenDetailsWithBalance[];
  onTransferTriggered: (transfer: () => Promise<Execution>) => Promise<void>;
  transferClassName?: string;
}

export const Transfer = ({transferService, tokenDetailsWithBalance, onTransferTriggered, transferClassName}: TransferProps) => {
  const [transferDetails, setTransferDetails] = useState({transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails);
  const [errors, setErrors] = useState<TransferErrors>({amount: [], to: []});

  const selectedToken = transferService.getTokenDetails(transferDetails.transferToken);
  const balance = getBalanceOf(selectedToken.symbol, tokenDetailsWithBalance);

  const onTransferClick = async () => {
    setErrors(await transferService.validateInputs(transferDetails, balance));
    if (transferService.areInputsValid()) {
      await onTransferTriggered(() => transferService.transfer(transferDetails));
    }
  };

  const updateField = (field: string) => (value: string | GasParameters) => {
    setTransferDetails({...transferDetails, ...{[field]: value}});
    setErrors({...errors, [field]: []});
  };

  return (
    <div className="universal-login-transfer">
      <div className={getStyleForTopLevelComponent(transferClassName)}>
        <div className="transfer">
          <TransferDropdown
            sdk={transferService.deployedWallet.sdk}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            tokenDetails={selectedToken}
            setToken={(token: TokenDetails) => updateField('transferToken')(token.address)}
            className={transferClassName}
          />
          <TransferAmount
            value={transferDetails.amount}
            tokenSymbol={selectedToken.symbol}
            errors={errors.amount}
            onChange={updateField('amount')}
            onMaxClick={() => updateField('amount')(transferService.getMaxAmount(transferDetails.gasParameters, balance))}
          />
          <TransferRecipient
            onChange={updateField('to')}
            errors={errors.to}
          />
        </div>
        <FooterSection className={transferClassName}>
          <GasPrice
            isDeployed={true}
            deployedWallet={transferService.deployedWallet}
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
