import React from 'react';
import {utils} from 'ethers';
import {GasOption, safeMultiply} from '@universal-login/commons';

interface SelectedGasPriceProps {
  modeName: string;
  gasLimit: utils.BigNumberish;
  usdAmount: utils.BigNumberish;
  onClick: () => void;
  gasOption: GasOption;
}

export const SelectedGasPrice = ({modeName, gasLimit, gasOption, usdAmount, onClick}: SelectedGasPriceProps) => (
  <div className="gas-price-selected">
    <div className="gas-price-selected-row">
      <div>
        <div className="transaction-fee-details">
          <img src="" alt="" className="transaction-fee-item-icon" />
          <div>
            <p className="transaction-fee-amount">{safeMultiply(gasOption.gasPrice, gasLimit)} {gasOption.token.symbol}</p>
            <p className="transaction-fee-amount-usd">{safeMultiply(utils.parseEther(usdAmount.toString()), gasLimit)} USD</p>
          </div>
        </div>
      </div>
      <hr className="gas-price-selected-divider" />
      <div>
        <p className="transaction-speed-type">{modeName}</p>
      </div>
    </div>
    <button className="gas-price-btn" onClick={onClick} />
  </div>
);
