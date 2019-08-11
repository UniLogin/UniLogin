import React, {useState} from 'react';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {DEFAULT_GAS_PRICE} from '@universal-login/commons';
import {Input} from '../commons/Input';
import {Balances} from './Balances';

interface BalancesWrapperProps {
  sdk: UniversalLoginSDK;
}

export const BalancesWrapper = ({sdk}: BalancesWrapperProps) => {
  const [ensName, setEnsName] = useState<string>('');
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('enter your name');

  const onCreateClick = async (ensName: string) => {
    const walletService = new WalletService(sdk);
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    setStatus(`Waiting for intial funds in ${contractAddress}`);
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await deploy(`${ensName}.mylogin.eth`, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(`${ensName}.mylogin.eth`);
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
  };

  const onSubscribeToBalances = (callback: Function) => {
    return sdk.subscribeToBalances(`${ensName}.mylogin.eth`, callback);
  };

  const onSubscribeToAggregateBalance = (callback: Function) => {
    return sdk.subscribeToAggregatedBalance(`${ensName}.mylogin.eth`, callback);
  };

  const renderBalances = () => {
    return contractAddress === '' ?
      <div>{status}</div> : (
      <Balances
        walletContractAddress={contractAddress}
        onSubscribeToBalances={onSubscribeToBalances}
        onSubscribeToAggregateBalance={onSubscribeToAggregateBalance}
      />
    );
  };

  return (
    <div className="universal-login">
      <div>
        <Input id={'topup-amount-input'} className={'topup-amount'} onChange={event => setEnsName(event.target.value)}/>
        <button onClick={() => onCreateClick(ensName)}>Create Demo Account</button>
        <div>{renderBalances()}</div>
      </div>
    </div>
  );
};
