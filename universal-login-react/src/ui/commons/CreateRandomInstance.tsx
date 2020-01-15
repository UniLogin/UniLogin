import React, {useState} from 'react';
import {WalletService} from '@universal-login/sdk';
import {DEV_DEFAULT_PRIVATE_KEY} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';
import {utils, Wallet} from 'ethers';

export interface CreateRandomInstanceProps {
  walletService: WalletService;
}

export const CreateRandomInstance = ({walletService}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ensName, setEnsName] = useState<string>('');

  const {sdk} = useServices();

  const createRandomInstance = async () => {
    const randomString = Math.random().toString(36).substring(7);
    const name = `${randomString}.mylogin.eth`;
    setEnsName(name);
    const {waitForBalance, contractAddress} = await walletService.createFutureWallet(name);
    setStatus(`Waiting for intial funds in ${contractAddress}`);
    const wallet = new Wallet(DEV_DEFAULT_PRIVATE_KEY, sdk.provider);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('4')});
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await walletService.deployFutureWallet();
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
  };

  return (
    <div>
      <button id="random-instance-button" onClick={createRandomInstance}>Create Random Instance</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
    </div>
  );
};
