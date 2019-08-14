import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {DEFAULT_GAS_PRICE} from '@universal-login/commons';

export interface CreateRandomInstanceProps {
  ensName: string;
  walletService: WalletService;
}

export const CreateRandomInstance = ({ensName, walletService}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const createRandomInstance = async () => {
    const {deploy, waitForBalance, contractAddress} = await walletService.createFutureWallet();
    setStatus(`Waiting for intial funds in ${contractAddress}`);
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await deploy(ensName, DEFAULT_GAS_PRICE.toString());
    walletService.setDeployed(ensName);
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
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
