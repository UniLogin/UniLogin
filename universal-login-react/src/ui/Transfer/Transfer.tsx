import React, {useState} from 'react';
import UniLoginSdk, {TransferService, TransferErrors, Execution} from '@unilogin/sdk';
import {TransferDetails, TokenDetails, GasParameters, getBalanceOf, ETHER_NATIVE_TOKEN, SEND_TRANSACTION_GAS_LIMIT, INITIAL_GAS_PARAMETERS, TransferToken} from '@unilogin/commons';
import {FooterSection} from '../commons/FooterSection';
import {GasPrice} from '../commons/GasPrice';
import {TransferAmount} from './Amount/TransferAmount';
import {TransferRecipient} from './Recipient/TransferRecipient';
import {TransferDropdown} from './Amount/TransferDropdown';
import {useBalances} from '../hooks/useBalances';
import {useClassFor} from '../utils/classFor';
import {PrimaryButton} from '../commons/Buttons/PrimaryButton';
import '../styles/base/transfer.sass';
import '../styles/themes/Legacy/transferThemeLegacy.sass';
import '../styles/themes/Jarvis/transferThemeJarvis.sass';
import '../styles/themes/UniLogin/transferThemeUniLogin.sass';
import './../styles/themes/Jarvis/footerThemeJarvis.sass';

export interface TransferProps {
  transferService: TransferService;
  onTransferTriggered: (transfer: () => Promise<Execution>) => Promise<void>;
  sdk: UniLoginSdk;
}

export const Transfer = ({transferService, onTransferTriggered, sdk}: TransferProps) => {
  const [transferDetails, setTransferDetails] = useState<TransferDetails>({token: {address: ETHER_NATIVE_TOKEN.address, decimals: 0}, amount: '', to: '', gasParameters: INITIAL_GAS_PARAMETERS});
  const [errors, setErrors] = useState<TransferErrors>({amount: [], to: []});
  const [tokenDetailsWithBalance] = useBalances(transferService.deployedWallet);
  const selectedToken = transferService.getTokenDetails(transferDetails.token.address);
  const balance = getBalanceOf(selectedToken.symbol, tokenDetailsWithBalance);
  const onTransferClick = async () => {
    setErrors(await transferService.validateInputs(transferDetails, balance));
    if (transferService.areInputsValid()) {
      await onTransferTriggered(() => transferService.transfer(transferDetails));
    }
  };

  const updateField = (field: string) => (value: TransferToken | string | GasParameters) => {
    setTransferDetails({...transferDetails, ...{[field]: value}});
    setErrors({...errors, [field]: []});
  };

  return (
    <div className={useClassFor('transfer')}>
      <div className="transfer">
        <TransferDropdown
          sdk={transferService.deployedWallet.sdk}
          tokenDetailsWithBalance={tokenDetailsWithBalance}
          tokenDetails={selectedToken}
          setToken={(token: TokenDetails) => {
            updateField('token')({address: token.address, decimals: token.decimals});
          }}
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
          sdk={sdk}
        />
        <div className="footer-buttons-row one">
          <PrimaryButton text='Send' id="send-button" onClick={onTransferClick} className="footer-approve-btn" disabled={!transferDetails.gasParameters || !balance}/>
        </div>
      </FooterSection>
    </div>
  );
};
