import {Wallet, providers} from 'ethers';
import {devJsonRpcUrl} from '@universal-login/commons';

export type AsyncCommand<T> = (wallet : Wallet, overrides: CommandOverrides) => Promise<T>;

export type CommandOverrides = {
  nodeUrl: string,
  privateKey: string,
  gasPrice?: string,
  nonce?: string
};

export default async function connectAndExecute<T>(overrides: CommandOverrides, command : AsyncCommand<T>) {
  const {wallet} = connect(overrides.nodeUrl, overrides.privateKey);
  await command(wallet, overrides);
}

export const connect = (givenNodeUrl : string, privateKey : string, givenProvider?: providers.Provider) => {
  const nodeUrl = givenNodeUrl ? givenNodeUrl : devJsonRpcUrl;
  const provider = givenProvider ? givenProvider : new providers.JsonRpcProvider(nodeUrl);
  const wallet = new Wallet(privateKey, provider);
  return {provider, wallet};
};
