import React, {useState} from 'react';
import {WalletService, DeployedWallet} from '@universal-login/sdk';
import {DEFAULT_GAS_PRICE, DEV_DEFAULT_PRIVATE_KEY, ETHER_NATIVE_TOKEN} from '@universal-login/commons';
import {useServices} from '../../core/services/useServices';
import {utils, Wallet} from 'ethers';

export interface CreateRandomInstanceProps {
  setDeployedWallet: (arg: DeployedWallet) => void;
}

export const CreateRandomInstance = ({setDeployedWallet}: CreateRandomInstanceProps) => {
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
    const wallet = new Wallet(DEV_DEFAULT_PRIVATE_KEY, sdk.provider);
    await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('4')});
    await waitForBalance();
    setStatus('waiting for wallet contract to be deployed');
    await deploy(name, DEFAULT_GAS_PRICE.toString(), ETHER_NATIVE_TOKEN.address);
    walletService.setDeployed(name);
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
    setDeployedWallet(walletService.getDeployedWallet());
  };

  return (
    <div>
      <button onClick={createRandomInstance}>Create Random Instance</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
    </div>
  );
};
