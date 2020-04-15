import React from 'react';
import styled from 'styled-components';
import {utils} from 'ethers';
import {GasMode, GasOption, safeMultiplyAndFormatEther, ValueRounder} from '@unilogin/commons';
import {DeployedWallet} from '@unilogin/sdk';
import {calculateTransactionFee, useBalances, Spinner} from '@unilogin/react';
import ethereumIcon from '../../assets/ethereum.svg';
import {Text} from '../common/Text/Text';

export interface TransactionFeeProps {
  mode: Pick<GasMode, 'name' | 'usdAmount'>;
  gasLimit: utils.BigNumberish;
  gasOption: GasOption;
  deployedWallet: DeployedWallet;
}

export const TransactionFee = ({mode, gasLimit, gasOption, deployedWallet}: TransactionFeeProps) => {
  const [, getBalanceBySymbol] = useBalances(deployedWallet);
  const balanceWithDetails = getBalanceBySymbol(gasOption.token.symbol);
  return (<FeeBlock>
    <Logo src={ethereumIcon} alt="ethereum logo" />
    <FeeRow>
      <div>
        <FeeAmount>{safeMultiplyAndFormatEther(gasOption.gasPrice, gasLimit)} {gasOption.token.symbol}</FeeAmount>
        <FeeText>= {calculateTransactionFee(mode.usdAmount, gasLimit)} USD</FeeText>
      </div>
      <div>
        <Text>Your balance</Text>
        {balanceWithDetails
          ? <FeeText>{ValueRounder.ceil(utils.formatEther(balanceWithDetails.balance))} {gasOption.token.symbol} </FeeText>
          : <Spinner className='spinner-small' />}
      </div>
    </FeeRow>
  </FeeBlock>);
};

const FeeBlock = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px 10px 12px;
  box-sizing: border-box;
  background: #F3FCFF;
  border: 1px solid #BDE6F2;
  border-radius: 4px;
`;

const Logo = styled.img`
  display: block;
  width: 24px;
  margin-right: 8px;
`;

const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const FeeAmount = styled.p`
  margin: 0 0 4px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #0F0C4A;
`;

const FeeText = styled.p`
  margin: 0;
  font-size: 10px;
  line-height: 12px;
  color: #0F0C4A;
  opacity: 0.5;
`;
