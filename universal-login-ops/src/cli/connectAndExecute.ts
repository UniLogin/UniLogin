import {Wallet, providers} from 'ethers';
import {devJsonRpcUrl} from '@unilogin/commons';

export type AsyncCommand<T> = (wallet: Wallet, overrides: CommandOverrides) => Promise<T>;

export type CommandOverrides = {
  nodeUrl: string;
  privateKey: string;
  gasPrice?: string;
  nonce?: string;
};

export default async function connectAndExecute<T>(overrides: CommandOverrides, command: AsyncCommand<T>) {
  const {wallet} = connectToEthereumNode(overrides.nodeUrl, overrides.privateKey);
  await command(wallet, overrides);
}

export const connectToEthereumNode = (givenNodeUrl: string, privateKey: string, givenProvider?: providers.Provider) => {
  const nodeUrl = givenNodeUrl || devJsonRpcUrl;
  const provider = givenProvider || new providers.JsonRpcProvider(nodeUrl);
  const wallet = new Wallet(privateKey, provider);
  return {provider, wallet};
};
