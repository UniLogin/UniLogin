import {IErc721Token} from '@unilogin/commons';
import {DeployedWithoutEmailWallet} from '@unilogin/sdk';
import {useState} from 'react';
import {useAsyncEffect} from './useAsyncEffect';

export const useErc721Tokens = (deployedWallet: DeployedWithoutEmailWallet): [IErc721Token[] | undefined] => {
  const [erc721Tokens, setErc721Tokens] = useState<IErc721Token[] | undefined>(undefined);
  useAsyncEffect(() => deployedWallet.subscribeToErc721Tokens(setErc721Tokens), []);
  return [erc721Tokens];
};
