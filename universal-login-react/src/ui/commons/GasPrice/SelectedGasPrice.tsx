import React from 'react';
import {utils} from 'ethers';
import {GasOption, safeMultiplyAndFormatEther, ValueRounder} from '@unilogin/commons';
import {calculateTransactionFee} from '../../../core/utils/calculateTransactionFee';
import {Erc20Icon} from '../Erc20Icon';
import Spinner from '../Spinner';

interface SelectedGasPriceProps {
  modeName: string;
  gasLimit?: utils.BigNumberish;
  usdAmount: utils.BigNumberish;
  onClick: () => void;
  gasOption: GasOption;
}

export const SelectedGasPrice = ({modeName, gasLimit, gasOption, usdAmount, onClick}: SelectedGasPriceProps) => (
  <div className="gas-price-selected">
    <div className="gas-price-selected-row">
      <div>
        <div className="transaction-fee-details">
          <Erc20Icon token={gasOption.token} className="transaction-fee-item-icon" />
          {gasLimit ? <div>
            <p className="transaction-fee-amount-usd">{calculateTransactionFee(usdAmount, gasLimit)} USD</p>
            <p className="transaction-fee-amount">{ValueRounder.ceil(safeMultiplyAndFormatEther(gasOption.gasPrice, gasLimit))} {gasOption.token.symbol}</p>
          </div> : <Spinner/>}
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
