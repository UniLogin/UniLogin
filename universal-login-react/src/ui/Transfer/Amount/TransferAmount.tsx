import React, {useState} from 'react';
import {TransferDropdown} from './TransferDropdown';
import {DeployedWallet} from '@universal-login/sdk';
import {TransferDetails, TokenDetailsWithBalance, getBalanceOf, TokenDetails, isValidAmount} from '@universal-login/commons';
import './../../styles/transferAmount.sass';
import './../../styles/transferAmountDefaults.sass';
import {getStyleForTopLevelComponent} from '../../../core/utils/getStyleForTopLevelComponent';
import {useAsyncEffect} from '../../hooks/useAsyncEffect';
import {FeatureFlag} from '../../commons/FeatureFlag';

export interface TransferAmountProps {
  deployedWallet: DeployedWallet;
  onSelectRecipientClick: () => void;
  updateTransferDetailsWith: (transferDetails: Partial<TransferDetails>) => void;
  tokenDetails: TokenDetails;
  transferAmountClassName?: string;
}

export const TransferAmount = ({deployedWallet, onSelectRecipientClick, updateTransferDetailsWith, tokenDetails, transferAmountClassName}: TransferAmountProps) => {
  const [tokenDetailsWithBalance, setTokenDetailsWithBalance] = useState<TokenDetailsWithBalance[]>([]);
  const [validAmount, setValidAmount] = useState(true);
  const [enableButton, setEnableButton] = useState(false);
  const {sdk, contractAddress} = deployedWallet;

  useAsyncEffect(() => sdk.subscribeToBalances(contractAddress, setTokenDetailsWithBalance), []);
  const balance = getBalanceOf(tokenDetails.symbol, tokenDetailsWithBalance);

  const validateAndUpdateTransferDetails = (amount: string) => {
    if (balance && isValidAmount(amount, balance)) {
      setValidAmount(true);
      setEnableButton(true);
      updateTransferDetailsWith({amount});
    } else {
      setValidAmount(false);
      setEnableButton(false);
    }
  };

  return (
    <div className="universal-login-amount">
      <div className={getStyleForTopLevelComponent(transferAmountClassName)}>
        <div className="transfer-amount">
          <TransferDropdown
            sdk={sdk}
            tokenDetailsWithBalance={tokenDetailsWithBalance}
            tokenDetails={tokenDetails}
            setToken={(token: TokenDetails) => updateTransferDetailsWith({transferToken: token.address})}
            className={transferAmountClassName}
          />
          <div className="transfer-amount-row">
            <label className="transfer-amount-label" htmlFor="amount-eth">How much are you sending?</label>
            <FeatureFlag sdk={sdk} feature="maxButton">
              <button className="transfer-amount-max">Max</button>
            </FeatureFlag>
          </div>
          <div className="transfer-amount-input-wrapper">
            <div className="transfer-amount-input-content">
              <input
                id="amount-eth"
                type="number"
                className="transfer-amount-input"
                onChange={event => validateAndUpdateTransferDetails(event.target.value)}
              />
              <span className="transfer-amount-code">{tokenDetails.symbol}</span>
            </div>
            {!validAmount && <div className="hint amount-input-hint">Invalid amount!</div>}
          </div>
          <button id="select-recipient" onClick={onSelectRecipientClick} className="transfer-amount-btn" disabled={!enableButton}>
            <span>Select recipient</span>
          </button>
        </div>
      </div>
    </div>
  );
};
