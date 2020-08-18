import React, {useState} from 'react';
import {utils, Wallet} from 'ethers';
import {DEV_DEFAULT_PRIVATE_KEY, DEV_DAI_ADDRESS, ensureNotNullish} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {sendDevDai} from './sendDai';

export interface CreateRandomInstanceProps {
  walletService: WalletService;
}

export const CreateRandomInstanceEmail = ({walletService}: CreateRandomInstanceProps) => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [ensName, setEnsName] = useState<string>('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const requestCreation = async () => {
    ensureNotNullish(email, Error, 'Email not provided');
    const randomString = Math.random().toString(36).substring(7);
    const name = `${randomString}.mylogin.eth`;
    setEnsName(name);
    await walletService.createRequestedCreatingWallet(email, name);
    setStatus('Email was sent');
  };

  const createRandomInstance = (token: 'ETH' | 'DAI') => async () => {
    ensureNotNullish(code, Error, 'Code not provided');
    await walletService.confirmCode(code);
    const generatedPassword = Math.random().toString(36).substring(7);
    setPassword(generatedPassword);
    const wallet = new Wallet(DEV_DEFAULT_PRIVATE_KEY, walletService.sdk.provider);
    if (token === 'ETH') {
      const {waitForBalance, contractAddress} = await walletService.createFutureWalletWithPassword(generatedPassword);
      setStatus(`Waiting for intial funds in ${contractAddress}`);
      await wallet.sendTransaction({to: contractAddress, value: utils.parseEther('4')});
      await waitForBalance();
    } else {
      const {waitForBalance, contractAddress} = await walletService.createFutureWalletWithPassword(generatedPassword, DEV_DAI_ADDRESS);
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
      Your e-mail:
      <br/>
      <input onChange={(event) => setEmail(event.target.value)} value={email} />
      <button id="random-instance-button" onClick={requestCreation}>Request email confirmation</button>
      <br />
      Code:
      <br />
      <input onChange={(event) => setCode(event.target.value)} value={code} />
      <br/>
      <button id="random-instance-button" onClick={createRandomInstance('ETH')}>Create with ETH</button>
      <br/>
      <button id="random-instance-button" onClick={createRandomInstance('DAI')}>Create with DAI</button>
      <p>{`ENS name: ${ensName}`}</p>
      <p>{`Wallet Contract address: ${contractAddress}`}</p>
      <p>{`Status: ${status}`}</p>
      <p>{`Password: ${password}`}</p>
    </div>
  );
};
