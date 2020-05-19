import React, {useState} from 'react';
import {utils, Wallet} from 'ethers';
import {DEV_DEFAULT_PRIVATE_KEY} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {IERC20Interface} from '@unilogin/contracts';

export interface CreateRandomInstanceProps {
  walletService: WalletService;
}

const daiAddressOnDevelopment = '0x9Ad7E60487F3737ed239DAaC172A4a9533Bd9517';
export const sendDevDai = async (wallet: Wallet, to: string, value: utils.BigNumberish) => {
  const data = IERC20Interface.functions.transfer.encode([to, value]);
  await wallet.sendTransaction({to: daiAddressOnDevelopment, data});
};

export const CreateRandomInstance = ({walletService}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ensName, setEnsName] = useState<string>('');

  const createRandomInstance = (token: 'ETH' | 'DAI') => async () => {
    const randomString = Math.random().toString(36).substring(7);
    const name = `${randomString}.mylogin.eth`;
    setEnsName(name);
    const wallet = new Wallet(DEV_DEFAULT_PRIVATE_KEY, walletService.sdk.provider);
    if (token === 'ETH') {
      const {waitForBalance, contractAddress} = await walletService.createFutureWallet(name);
      setStatus(`Waiting for intial funds in ${contractAddress}`);
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('4')});
      await waitForBalance();
    } else {
      const {waitForBalance, contractAddress} = await walletService.createFutureWallet(name, daiAddressOnDevelopment);
      setStatus(`Waiting for intial funds in ${contractAddress}`);
      await sendDevDai(wallet, contractAddress, utils.parseEther('1000'));
      await waitForBalance();
    }
    setStatus('waiting for wallet contract to be deployed');
    await walletService.deployFutureWallet();
    setStatus(`Wallet contract deployed at ${contractAddress}`);
    setContractAddress(contractAddress);
    setStatus('');
  };

  return (
    <div>
      <button id="random-instance-button" onClick={createRandomInstance('ETH')}>Create with ETH</button>
      <br/>
      <button id="random-instance-button" onClick={createRandomInstance('DAI')}>Create with DAI</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
    </div>
  );
};
