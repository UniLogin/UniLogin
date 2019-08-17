import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {DEFAULT_GAS_PRICE, ApplicationWallet} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';

export interface CreateRandomInstanceProps {
  setApplicationWallet: (arg: ApplicationWallet) => void;
}

export const CreateRandomInstance = ({setApplicationWallet}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ensName, setEnsName] = useState<string>('');

  const {sdk} = useServices();

  const createRandomInstance = async () => {
    const randomString = Math.random().toString(36).substring(7);
    const name = `${randomString}.mylogin.eth`;
    setEnsName(name);
    const walletService = new WalletService(sdk);
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    setStatus(`Waiting for intial funds in ${contractAddress}`);
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await deploy(name, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(name);
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
    setApplicationWallet(walletService.applicationWallet as ApplicationWallet);
  };

  return (
    <div>
      <button onClick={createRandomInstance}>Create Ranodm Instance</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
    </div>
  );
};
