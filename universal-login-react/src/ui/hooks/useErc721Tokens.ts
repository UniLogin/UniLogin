import {IErc721Token} from '@unilogin/commons';
import {DeployedWallet} from '@unilogin/sdk';
import {useState} from 'react';
import {useAsyncEffect} from './useAsyncEffect';

export const useErc721Tokens = (deployedWallet: DeployedWallet): [IErc721Token[] | undefined] => {
  const [erc721Tokens, setErc721Tokens] = useState<IErc721Token[] | undefined>(undefined);
  useAsyncEffect(() => deployedWallet.subscribeToErc721Tokens(setErc721Tokens), []);
  return [erc721Tokens];
};
