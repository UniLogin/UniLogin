import React, {useState} from 'react';
import {TransferDetails, isProperAddress, OnGasParametersChanged, DEPLOYMENT_REFUND} from '@universal-login/commons';
import './../../styles/transferRecipient.sass';
import './../../styles/transferRecipientDefaults.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {FooterSection} from '../../commons/FooterSection';
import {DeployedWallet} from '@universal-login/sdk';
import {GasPrice} from '../../commons/GasPrice';

export interface TransferRecipientProps {
  symbol: string;
  onRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendClick: () => Promise<void>;
  transferDetails: Partial<TransferDetails>;
  className?: string;
  deployedWallet: DeployedWallet;
  onGasParametersChanged: OnGasParametersChanged;
}

export const TransferRecipient = ({onRecipientChange, onSendClick, className, deployedWallet, onGasParametersChanged, transferDetails: {amount, to, gasParameters}, symbol}: TransferRecipientProps) => {
  const [showError, setShowError] = useState<boolean>(false);
  const errorMessage = 'Invalid address';

  const onClick = () => isProperAddress(to || '') ? onSendClick() : setShowError(true);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    showError && setShowError(false);
    onRecipientChange(event);
  };

  return (
    <div className="universal-login-recipient">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="transfer-recipient">
          <div>
            <p className="transfer-recipient-text">To who are you sending {amount} {symbol}?</p>
            <div className="transfer-recipient-input-wrapper">
              <label className="transfer-recipient-label" htmlFor="">Recipient</label>
              <input
                id="input-recipient"
                className="transfer-recipient-input"
                onChange={onChange}
              />
              {showError && <div className="hint">{errorMessage}</div>}
            </div>
          </div>
          <FooterSection className={className}>
            <GasPrice
              isDeployed={true}
              deployedWallet={deployedWallet}
              gasLimit={DEPLOYMENT_REFUND}
              onGasParametersChanged={onGasParametersChanged}
              className={className}
            />
            <div className="footer-buttons-row">
              <button id="send-button" onClick={onClick} className="footer-approve-btn" disabled={!gasParameters}>Send</button>
            </div>
          </FooterSection>
        </div>
      </div>
    </div>
  );
};
