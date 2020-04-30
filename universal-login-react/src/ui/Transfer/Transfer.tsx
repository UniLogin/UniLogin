import React, {useState} from 'react';
import UniversalLoginSDK, {TransferService, TransferErrors, Execution} from '@unilogin/sdk';
import {TransferDetails, TokenDetails, GasParameters, getBalanceOf, ETHER_NATIVE_TOKEN, SEND_TRANSACTION_GAS_LIMIT} from '@unilogin/commons';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {TransferAmount} from './Amount/TransferAmount';
import {TransferRecipient} from './Recipient/TransferRecipient';
import {TransferDropdown} from './Amount/TransferDropdown';
import {useBalances} from '../hooks/useBalances';
import '../styles/transfer.sass';
import '../styles/transferDefaults.sass';
import '../styles/themes/Jarvis/transferThemeJarvis.sass';
import '../styles/themes/UniLogin/transferThemeUniLogin.sass';
import './../styles/themes/Jarvis/footerThemeJarvis.sass';

export interface TransferProps {
  transferService: TransferService;
  onTransferTriggered: (transfer: () => Promise<Execution>) => Promise<void>;
  transferClassName?: string;
  sdk: UniversalLoginSDK;
}

export const Transfer = ({transferService, onTransferTriggered, transferClassName, sdk}: TransferProps) => {
  const [transferDetails, setTransferDetails] = useState({transferToken: ETHER_NATIVE_TOKEN.address} as TransferDetails);
  const [errors, setErrors] = useState<TransferErrors>({amount: [], to: []});
  const [tokenDetailsWithBalance] = useBalances(transferService.deployedWallet);

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
          />
          <TransferRecipient
            onChange={updateField('to')}
            errors={errors.to}
          />
        </div>
        <FooterSection>
          <GasPrice
            isDeployed={true}
            deployedWallet={transferService.deployedWallet}
            gasLimit={SEND_TRANSACTION_GAS_LIMIT}
            onGasParametersChanged={(gasParameters: GasParameters) => updateField('gasParameters')(gasParameters)}
            className={transferClassName}
            sdk={sdk}
          />
          <div className="footer-buttons-row">
            <button id="send-button" onClick={onTransferClick} className="footer-approve-btn" disabled={!transferDetails.gasParameters}>Send</button>
          </div>
        </FooterSection>
      </div>
    </div>
  );
};
